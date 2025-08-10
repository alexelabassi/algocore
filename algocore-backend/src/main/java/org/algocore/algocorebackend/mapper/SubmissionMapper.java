package org.algocore.algocorebackend.mapper;

import org.algocore.algocorebackend.dto.submission.SubmissionResponseDto;
import org.algocore.algocorebackend.dto.submission.SubmissionListDto;
import org.algocore.algocorebackend.entity.Submission;
import org.springframework.stereotype.Component;

@Component
public class SubmissionMapper {
    public SubmissionResponseDto submissionToSubmissionResponseDto(Submission submission) {
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

    public SubmissionListDto submissionToSubmissionListDto(Submission submission) {
        return new SubmissionListDto(
                submission.getId(),
                submission.getUser().getUsername(),
                submission.getResult(),
                submission.getLanguage(),
                submission.getRuntimeMs(),
                submission.getMemoryKb(),
                submission.getSubmittedAt()
        );
    }
}
