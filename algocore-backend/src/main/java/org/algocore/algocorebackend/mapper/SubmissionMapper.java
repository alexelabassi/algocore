package org.algocore.algocorebackend.mapper;

import org.algocore.algocorebackend.dto.submission.SubmissionResponseDto;
import org.algocore.algocorebackend.entity.Submission;
import org.springframework.stereotype.Component;

@Component
public class SubmissionMapper {
    public SubmissionResponseDto SubmissionToSubmissionResponseDto(Submission submission) {
        return new SubmissionResponseDto(
                submission.getId(),
                submission.getResult(),
                submission.getStdout(),
                submission.getStderr(),
                submission.getRuntimeMs(),
                submission.getMemoryKb(),
                submission.getFailedTestCaseId(),
                submission.getExpectedOutput(),
                submission.getActualOutput()
        );
    }
}
