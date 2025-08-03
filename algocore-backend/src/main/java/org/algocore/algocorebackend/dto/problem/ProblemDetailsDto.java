package org.algocore.algocorebackend.dto.problem;

import org.algocore.algocorebackend.entity.ProblemDifficulty;
import org.algocore.algocorebackend.entity.SchoolGrade;

import java.util.UUID;

public record ProblemDetailsDto(
        UUID id,
        String title,
        String description,
        ProblemDifficulty difficulty,
        SchoolGrade schoolGrade
) {
}
