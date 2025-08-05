package org.algocore.algocorebackend.dto.submission;

import org.algocore.algocorebackend.entity.SubmissionResult;

import java.util.UUID;

public record SubmissionResponseDto(
        UUID submissionId,
        SubmissionResult result,
        String stdout,
        String stderr,
        Long runtimeMs,
        Long memoryKb
){
}
