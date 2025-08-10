package org.algocore.algocorebackend.controller;

import lombok.RequiredArgsConstructor;
import org.algocore.algocorebackend.dto.submission.SubmissionResponseDto;
import org.algocore.algocorebackend.dto.submission.SubmissionListDto;
import org.algocore.algocorebackend.entity.User;
import org.algocore.algocorebackend.service.SubmissionService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/submissions")
@RequiredArgsConstructor
public class SubmissionController {
    private final SubmissionService submissionService;

    @GetMapping("/me/problems/{problemId}")
    public Page<SubmissionResponseDto> getMySubmissionsForProblem(
            @PathVariable UUID problemId,
            @AuthenticationPrincipal User user,
            @ParameterObject Pageable pageable
    ) {
        return submissionService.getMySubmissionsForProblem(problemId, user, pageable);
    }

    @GetMapping("/me/problems/{problemId}/list")
    public Page<SubmissionListDto> getMySubmissionsForProblemList(
            @PathVariable UUID problemId,
            @AuthenticationPrincipal User user,
            @ParameterObject Pageable pageable
    ) {
        return submissionService.getMySubmissionsForProblemList(problemId, user, pageable);
    }

    @GetMapping("/problems/{problemId}")
    public Page<SubmissionListDto> getSubmissionsForProblem(
            @PathVariable UUID problemId,
            @ParameterObject Pageable pageable
    ) {
        return submissionService.getSubmissionsForProblem(problemId, pageable);
    }
}
