package org.algocore.algocorebackend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.algocore.algocorebackend.dto.submission.SubmissionResponseDto;
import org.algocore.algocorebackend.dto.submission.SubmissionListDto;
import org.algocore.algocorebackend.entity.User;
import org.algocore.algocorebackend.service.SubmissionService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

    /**
     * Get detailed submissions for a specific problem by the authenticated user.
     * 
     * @param problemId The ID of the problem
     * @param user The authenticated user
     * @param pageable Pagination parameters
     * @return Paginated list of detailed submission responses
     */
    @GetMapping("/me/problems/{problemId}")
    public ResponseEntity<Page<SubmissionResponseDto>> getMySubmissionsForProblem(
            @PathVariable UUID problemId,
            @AuthenticationPrincipal User user,
            @ParameterObject Pageable pageable
    ) {
        try {
            log.info("Fetching user submissions for problem: {}, user: {}", problemId, user.getUsername());
            Page<SubmissionResponseDto> submissions = submissionService.getMySubmissionsForProblem(problemId, user, pageable);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            log.error("Error fetching user submissions for problem: {}", problemId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get summary submissions list for a specific problem by the authenticated user.
     * 
     * @param problemId The ID of the problem
     * @param user The authenticated user
     * @param pageable Pagination parameters
     * @return Paginated list of submission summaries
     */
    @GetMapping("/me/problems/{problemId}/list")
    public ResponseEntity<Page<SubmissionListDto>> getMySubmissionsForProblemList(
            @PathVariable UUID problemId,
            @AuthenticationPrincipal User user,
            @ParameterObject Pageable pageable
    ) {
        try {
            log.info("Fetching user submissions list for problem: {}, user: {}", problemId, user.getUsername());
            Page<SubmissionListDto> submissions = submissionService.getMySubmissionsForProblemList(problemId, user, pageable);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            log.error("Error fetching user submissions list for problem: {}", problemId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get all submissions for a specific problem (public endpoint).
     * 
     * @param problemId The ID of the problem
     * @param pageable Pagination parameters
     * @return Paginated list of submission summaries
     */
    @GetMapping("/problems/{problemId}")
    public ResponseEntity<Page<SubmissionListDto>> getSubmissionsForProblem(
            @PathVariable UUID problemId,
            @ParameterObject Pageable pageable
    ) {
        try {
            log.info("Fetching all submissions for problem: {}", problemId);
            Page<SubmissionListDto> submissions = submissionService.getSubmissionsForProblem(problemId, pageable);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            log.error("Error fetching submissions for problem: {}", problemId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
