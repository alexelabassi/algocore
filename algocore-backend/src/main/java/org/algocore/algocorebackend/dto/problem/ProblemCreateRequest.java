package org.algocore.algocorebackend.dto.problem;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.algocore.algocorebackend.dto.testcase.TestCaseRequestDto;
import org.algocore.algocorebackend.entity.ProblemDifficulty;
import org.algocore.algocorebackend.entity.SchoolGrade;

import java.util.List;

public record ProblemCreateRequest(
        @NotBlank
        @Size(min = 3, max = 100)
        String title,

        @NotBlank
        String description,

        @NotNull
        ProblemDifficulty difficulty,

        @NotNull
        SchoolGrade grade,

        // aici ar trebui sa adaug vector de problem languagedto, cu language si string templateCode

        List<TestCaseRequestDto> testCases
) {
}
