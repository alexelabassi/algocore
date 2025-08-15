package org.algocore.algocorebackend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.algocore.algocorebackend.dto.submission.SubmissionListDto;
import org.algocore.algocorebackend.dto.submission.SubmissionResponseDto;
import org.algocore.algocorebackend.entity.User;
import org.algocore.algocorebackend.service.SubmissionService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/**
 * REST Controller for managing submission-related operations.
 * Provides endpoints for retrieving submissions for problems with pagination support.
 */
@RestController
@RequestMapping("/submissions")
@RequiredArgsConstructor
@Slf4j
public class SubmissionController {
    private final SubmissionService submissionService;

    @GetMapping("/me/problems/{problemId}")
    public ResponseEntity<Page<SubmissionResponseDto>> getMySubmissionsForProblem(
            @PathVariable UUID problemId,
            @AuthenticationPrincipal User user,
            @ParameterObject Pageable pageable
    ) {
        Page<SubmissionResponseDto> submissions = submissionService.getMySubmissionsForProblem(problemId, user, pageable);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/me/problems/{problemId}/list")
    public ResponseEntity<Page<SubmissionListDto>> getMySubmissionsForProblemList(
            @PathVariable UUID problemId,
            @AuthenticationPrincipal User user,
            @ParameterObject Pageable pageable
    ) {
        Page<SubmissionListDto> submissions = submissionService.getMySubmissionsForProblemList(problemId, user, pageable);
        return ResponseEntity.ok(submissions);
    }


    @GetMapping("/problems/{problemId}")
    public ResponseEntity<Page<SubmissionListDto>> getSubmissionsForProblem(
            @PathVariable UUID problemId,
            @ParameterObject Pageable pageable
    ) {
        Page<SubmissionListDto> submissions = submissionService.getSubmissionsForProblem(problemId, pageable);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/me")
    public ResponseEntity<Page<SubmissionListDto>> getMySubmissions(
            @AuthenticationPrincipal User user,
            @ParameterObject Pageable pageable
    ) {
        Page<SubmissionListDto> submissions = submissionService.getMySubmissions(user, pageable);
        return ResponseEntity.ok(submissions);
    }
}
