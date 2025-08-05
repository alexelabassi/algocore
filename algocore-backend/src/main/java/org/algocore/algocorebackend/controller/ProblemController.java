package org.algocore.algocorebackend.controller;

import jakarta.validation.Valid;
import org.algocore.algocorebackend.dto.problem.ProblemCreateRequest;
import org.algocore.algocorebackend.dto.problem.ProblemDetailsDto;
import org.algocore.algocorebackend.dto.submission.SubmissionRequestDto;
import org.algocore.algocorebackend.dto.submission.SubmissionResponseDto;
import org.algocore.algocorebackend.entity.Problem;
import org.algocore.algocorebackend.entity.User;
import org.algocore.algocorebackend.service.ProblemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/problems")
public class ProblemController {
    private ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @PostMapping("/create")
    public ResponseEntity<ProblemDetailsDto> createProblem(@Valid @RequestBody ProblemCreateRequest request) {
        ProblemDetailsDto problemDetails = problemService.createProblem(request);
        return ResponseEntity.ok(problemDetails);
    }

    @GetMapping()
    public ResponseEntity<List<ProblemDetailsDto>> getAllProblems() {
        List<ProblemDetailsDto> problems = problemService.getAllProblems();
        return ResponseEntity.ok(problems);
    }

    @PostMapping("/{problemId}/submit")
    public ResponseEntity<User> submitProblem(@PathVariable String problemId, @Valid @RequestBody SubmissionRequestDto req,
                                              @AuthenticationPrincipal User user) {
        SubmissionResponseDto submissionResponse = problemService.submitProblem(problemId, req, user);
        return ResponseEntity.ok(submissionResponse);
    }
}
