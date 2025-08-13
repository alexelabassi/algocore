package org.algocore.algocorebackend.controller;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.algocore.algocorebackend.dto.problem.ProblemCreateRequest;
import org.algocore.algocorebackend.dto.problem.ProblemDetailsDto;
import org.algocore.algocorebackend.dto.submission.SubmissionRequestDto;
import org.algocore.algocorebackend.dto.submission.SubmissionResponseDto;
import org.algocore.algocorebackend.entity.User;
import org.algocore.algocorebackend.service.ProblemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import org.algocore.algocorebackend.dto.testcase.TestCaseRequestDto;

@RestController
@RequestMapping("/problems")
@Slf4j
public class ProblemController {
    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @PostMapping("/create")
    public ResponseEntity<ProblemDetailsDto> createProblem(@Valid @RequestBody ProblemCreateRequest request) {
        try {
            log.info("Creating new problem: {}", request.title());
            ProblemDetailsDto problemDetails = problemService.createProblem(request);
            return ResponseEntity.ok(problemDetails);
        } catch (Exception e) {
            log.error("Error creating problem: {}", request.title(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping()
    public ResponseEntity<List<ProblemDetailsDto>> getAllProblems(@AuthenticationPrincipal User user) {
        try {
            log.info("Fetching all problems for user: {}", user != null ? user.getUsername() : "anonymous");
            List<ProblemDetailsDto> problems = (user != null)
                    ? problemService.getAllProblems(user)
                    : problemService.getAllProblems();
            return ResponseEntity.ok(problems);
        } catch (Exception e) {
            log.error("Error fetching all problems", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{problemId}")
    public ResponseEntity<ProblemDetailsDto> getProblemById(@PathVariable UUID problemId,
                                                            @AuthenticationPrincipal User user) {
        try {
            log.info("Fetching problem: {} for user: {}", problemId, user != null ? user.getUsername() : "anonymous");
            ProblemDetailsDto problemDetails = (user != null)
                    ? problemService.getProblemById(problemId, user)
                    : problemService.getProblemById(problemId);
            return ResponseEntity.ok(problemDetails);
        } catch (Exception e) {
            log.error("Error fetching problem: {}", problemId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{problemId}/submit")
    public ResponseEntity<SubmissionResponseDto> submitProblem(@PathVariable UUID problemId, 
                                                               @Valid @RequestBody SubmissionRequestDto req,
                                                               @AuthenticationPrincipal User user) {
        try {
            log.info("Submitting solution for problem: {} by user: {}", problemId, user.getUsername());
            SubmissionResponseDto submissionResponse = problemService.submitProblem(problemId, req, user);
            return ResponseEntity.ok(submissionResponse);
        } catch (Exception e) {
            log.error("Error submitting solution for problem: {}", problemId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{problemId}")
    public ResponseEntity<Void> deleteProblem(@PathVariable UUID problemId) {
        try {
            log.info("Deleting problem: {}", problemId);
            problemService.deleteProblem(problemId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting problem: {}", problemId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{problemId}/testcases")
    public ResponseEntity<List<TestCaseRequestDto>> getProblemTestCases(@PathVariable UUID problemId) {
        try {
            log.info("Fetching test cases for problem: {}", problemId);
            List<TestCaseRequestDto> testCases = problemService.getProblemTestCases(problemId);
            return ResponseEntity.ok(testCases);
        } catch (Exception e) {
            log.error("Error fetching test cases for problem: {}", problemId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{problemId}/testcases")
    public ResponseEntity<ProblemDetailsDto> updateProblemTestCases(@PathVariable UUID problemId,
                                                                    @Valid @RequestBody List<TestCaseRequestDto> testCases) {
        try {
            log.info("Updating test cases for problem: {}", problemId);
            ProblemDetailsDto problemDetails = problemService.updateProblemTestCases(problemId, testCases);
            return ResponseEntity.ok(problemDetails);
        } catch (Exception e) {
            log.error("Error updating test cases for problem: {}", problemId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
