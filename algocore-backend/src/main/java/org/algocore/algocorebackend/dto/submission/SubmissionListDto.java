package org.algocore.algocorebackend.dto.submission;

import org.algocore.algocorebackend.entity.SubmissionResult;

import java.time.Instant;
import java.util.UUID;

public record SubmissionListDto(
        UUID submissionId,
        String username,
        SubmissionResult result,
        String language,
        Long runtimeMs,
        Long memoryKb,
        Instant submittedAt,
        UUID problemId,
        String problemTitle
){
}