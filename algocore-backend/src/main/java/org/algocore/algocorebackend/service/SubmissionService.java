package org.algocore.algocorebackend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.algocore.algocorebackend.dto.judge0.Judge0Response;
import org.algocore.algocorebackend.dto.submission.SubmissionRequestDto;
import org.algocore.algocorebackend.dto.submission.SubmissionResponseDto;
import org.algocore.algocorebackend.entity.Submission;
import org.algocore.algocorebackend.entity.SubmissionResult;
import org.algocore.algocorebackend.entity.TestCase;
import org.algocore.algocorebackend.entity.User;
import org.algocore.algocorebackend.integration.Judge0Client;
import org.algocore.algocorebackend.mapper.SubmissionMapper;
import org.algocore.algocorebackend.repository.ProblemRepository;
import org.algocore.algocorebackend.repository.SubmissionRepository;
import org.algocore.algocorebackend.repository.TestCaseRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubmissionService {
    private final ProblemRepository problemRepo;
    private final TestCaseRepository testCaseRepo;
    private final SubmissionRepository submissionRepo;
    private final Judge0Client judge0Client;
    private final SubmissionMapper submissionMapper;

    public SubmissionResponseDto submit(UUID problemId, SubmissionRequestDto req, User currentUser) {
        Submission submission = initSubmission(problemId, req, currentUser);
        List<TestCase> tests = testCaseRepo.findByProblemAndHiddenFalse(submission.getProblem());

        long totalRuntime = 0;
        int totalMemory = 0;

        for (TestCase test : tests) {
            Judge0Response result = judge0Client.run(req.code(), req.language(), test.getInput());
            updateMetrics(submission, result);

            if (resultFailed(test, result)) {
                recordFailure(submission, test, result);
                return submissionMapper.SubmissionToSubmissionResponseDto(submission);
            }
        }

        recordSuccess(submission, totalRuntime, totalMemory);
        return submissionMapper.SubmissionToSubmissionResponseDto(submission);
    }

    private Submission initSubmission(UUID problemId, SubmissionRequestDto req, User user) {
        var problem = problemRepo.findById(problemId)
                .orElseThrow(() -> new EntityNotFoundException("Problem not found: " + problemId));

        Submission submission = Submission.builder()
                .user(user)
                .problem(problem)
                .code(req.code())
                .language(req.language())
                .result(SubmissionResult.PENDING)
                .submittedAt(Instant.now())
                .build();

        return submissionRepo.save(submission);
    }

    private void updateMetrics(Submission submission, Judge0Response r) {
        long runMs = r.time() != null ? (long) (r.time() * 1000) : 0;
        long memKb = r.memory() != null ? r.memory() : 0;
        submission.setRuntimeMs(runMs);
        submission.setMemoryKb(memKb);
    }

    private boolean resultFailed(TestCase test, Judge0Response r) {
        String actual = r.stdout() != null ? r.stdout().strip() : "";
        String expected = test.getExpectedOutput().strip();
        return !actual.equals(expected);
    }

    private void recordFailure(Submission submission, TestCase test, Judge0Response r) {
        submission.setResult(SubmissionResult.WRONG_ANSWER);
        submission.setStdout(r.stdout());
        submission.setStderr(r.stderr() != null ? r.stderr() : r.compileOutput());
        submission.setFailedTestCaseId(test.getId());
        submission.setExpectedOutput(test.getExpectedOutput().strip());
        submission.setActualOutput(r.stdout() != null ? r.stdout().strip() : "");
        submissionRepo.save(submission);
    }

    private void recordSuccess(Submission submission, long totalRuntime, long totalMemory) {
        submission.setResult(SubmissionResult.ACCEPTED);
        submission.setRuntimeMs(totalRuntime);
        submission.setMemoryKb(totalMemory);
        submissionRepo.save(submission);
    }
}