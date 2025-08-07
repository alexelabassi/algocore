package org.algocore.algocorebackend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.algocore.algocorebackend.dto.submission.SubmissionRequestDto;
import org.algocore.algocorebackend.dto.submission.SubmissionResponseDto;
import org.algocore.algocorebackend.entity.*;
import org.algocore.algocorebackend.integration.Judge0Client;
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

    public SubmissionResponseDto submit(UUID problemId,
                                        SubmissionRequestDto req,
                                        User currentUser) {

        Problem problem = problemRepo.findById(problemId)
                .orElseThrow(() -> new EntityNotFoundException("Problem not found: " + problemId));

        // 2) Create initial submission
        Submission submission = Submission.builder()
                .user(currentUser)
                .problem(problem)
                .code(req.code())
                .language(req.language())
                .result(SubmissionResult.PENDING)
                .submittedAt(Instant.now())
                // new fields default to null
                .failedTestCaseId(null)
                .expectedOutput(null)
                .actualOutput(null)
                .build();
        submissionRepo.save(submission);

        List<TestCase> tests = testCaseRepo.findByProblemAndHiddenFalse(problem);

        long totalRuntime = 0;
        long totalMemory = 0;

        // 3) Run each test
        for (TestCase tc : tests) {
            Judge0Client.Response r = judge0Client.run(req.code(), req.language(), tc.getInput());
            if (r == null) {
                submission.setResult(SubmissionResult.INTERNAL_ERROR);
                submission.setStdout(null);
                submission.setStderr("No response from execution service");
                submissionRepo.save(submission);
                return map(submission);
            }

            long runMs = r.time() != null ? (long) (r.time() * 1000) : 0;
            long memKb = r.memory() != null ? r.memory() : 0;
            totalRuntime += runMs;
            totalMemory += memKb;

            String actual = r.stdout() != null ? r.stdout().strip() : "";
            String expected = tc.getExpectedOutput().strip();

            // 4) On first failure, record everything
            if (!actual.equals(expected)) {
                submission.setResult(SubmissionResult.WRONG_ANSWER);
                submission.setStdout(r.stdout());
                submission.setStderr(r.stderr() != null ? r.stderr() : r.compile_output());
                submission.setRuntimeMs(runMs);
                submission.setMemoryKb(memKb);
                // new fields:
                submission.setFailedTestCaseId(tc.getId());
                submission.setExpectedOutput(expected);
                submission.setActualOutput(actual);
                submissionRepo.save(submission);
                return map(submission);
            }
        }

        // 5) All passed
        submission.setResult(SubmissionResult.ACCEPTED);
        submission.setMemoryKb(totalMemory);
        submissionRepo.save(submission);
        return map(submission);
    }


    private SubmissionResponseDto map(Submission s) {
        return new SubmissionResponseDto(
                s.getId(),
                s.getResult(),
                s.getStdout(),
                s.getStderr(),
                s.getRuntimeMs(),
                s.getMemoryKb(),
                // include new fields in DTO
                s.getFailedTestCaseId(),
                s.getExpectedOutput(),
                s.getActualOutput()
        );
    }
}
