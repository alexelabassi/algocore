package org.algocore.algocorebackend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.algocore.algocorebackend.dto.judge0.Judge0Response;
import org.algocore.algocorebackend.dto.submission.SubmissionRequestDto;
import org.algocore.algocorebackend.dto.submission.SubmissionResponseDto;
import org.algocore.algocorebackend.dto.submission.SubmissionListDto;
import org.algocore.algocorebackend.entity.*;
import org.algocore.algocorebackend.integration.Judge0Client;
import org.algocore.algocorebackend.mapper.SubmissionMapper;
import org.algocore.algocorebackend.repository.ProblemRepository;
import org.algocore.algocorebackend.repository.SubmissionRepository;
import org.algocore.algocorebackend.repository.TestCaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        try {
            Submission submission = initSubmission(problemId, req, currentUser);
            List<TestCase> tests = testCaseRepo.findByProblem(submission.getProblem());

            if (tests.isEmpty()) {
                submission.setResult(SubmissionResult.WRONG_ANSWER);
                submission.setStderr("No test cases found for this problem");
                submissionRepo.save(submission);
                return submissionMapper.submissionToSubmissionResponseDto(submission);
            }

            long totalRuntime = 0;
            long totalMemory = 0;

            for (TestCase test : tests) {
                Judge0Response result = judge0Client.run(req.code(), req.language(), test.getInput());
                
                // Accumulate runtime and memory
                long runMs = result.time() != null ? (long) (result.time() * 1000) : 0;
                long memKb = result.memory() != null ? result.memory() : 0;
                totalRuntime += runMs;
                totalMemory += memKb;
                
                updateMetrics(submission, result);

                if (resultFailed(test, result)) {
                    recordFailure(submission, test, result);
                    return submissionMapper.submissionToSubmissionResponseDto(submission);
                }
            }

            recordSuccess(submission, totalRuntime, totalMemory);
            return submissionMapper.submissionToSubmissionResponseDto(submission);
        } catch (Exception e) {
            // Handle any unexpected errors
            Submission errorSubmission = initSubmission(problemId, req, currentUser);
            errorSubmission.setResult(SubmissionResult.RUNTIME_ERROR);
            errorSubmission.setStderr("Unexpected error: " + e.getMessage());
            submissionRepo.save(errorSubmission);
            return submissionMapper.submissionToSubmissionResponseDto(errorSubmission);
        }
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

    public boolean hasUserSolvedProblem(Problem problem, User user) {
        return submissionRepo.existsByProblemAndUserAndResult(problem, user, SubmissionResult.ACCEPTED);
    }

    public Page<SubmissionResponseDto> getMySubmissionsForProblem(UUID problemId, User user, Pageable pageable) {
        Page<Submission> page = submissionRepo.findByProblem_IdAndUser_IdOrderBySubmittedAtDesc(problemId, user.getId(), pageable);
        return page.map(submissionMapper::submissionToSubmissionResponseDto);
    }

    public Page<SubmissionListDto> getSubmissionsForProblem(UUID problemId, Pageable pageable) {
        Page<Submission> page = submissionRepo.findByProblem_IdOrderBySubmittedAtDesc(problemId, pageable);
        return page.map(submissionMapper::submissionToSubmissionListDto);
    }

    public Page<SubmissionListDto> getMySubmissionsForProblemList(UUID problemId, User user, Pageable pageable) {
        Page<Submission> page = submissionRepo.findByProblem_IdAndUser_IdOrderBySubmittedAtDesc(problemId, user.getId(), pageable);
        return page.map(submissionMapper::submissionToSubmissionListDto);
    }

    public Page<SubmissionListDto> getMySubmissions(User user, Pageable pageable) {
        Page<Submission> page = submissionRepo.findByUser_IdOrderBySubmittedAtDesc(user.getId(), pageable);
        return page.map(submissionMapper::submissionToSubmissionListDto);
    }

    // Utility methods for statistics and additional functionality
    public long getTotalSubmissionsForProblem(UUID problemId) {
        return submissionRepo.countByProblem_Id(problemId);
    }

    public long getAcceptedSubmissionsForProblem(UUID problemId) {
        return submissionRepo.countByProblem_IdAndResult(problemId, SubmissionResult.ACCEPTED);
    }

    public double getAcceptanceRateForProblem(UUID problemId) {
        long total = getTotalSubmissionsForProblem(problemId);
        if (total == 0) return 0.0;
        long accepted = getAcceptedSubmissionsForProblem(problemId);
        return (double) accepted / total * 100;
    }
}