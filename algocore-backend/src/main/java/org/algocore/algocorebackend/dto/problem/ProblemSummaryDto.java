package org.algocore.algocorebackend.dto.problem;

import org.algocore.algocorebackend.entity.ProblemDifficulty;
import org.algocore.algocorebackend.entity.SchoolGrade;

import java.util.UUID;

public record ProblemSummaryDto(
    UUID id,
    String title,
    ProblemDifficulty difficulty,
    SchoolGrade schoolGrade
) {
}
