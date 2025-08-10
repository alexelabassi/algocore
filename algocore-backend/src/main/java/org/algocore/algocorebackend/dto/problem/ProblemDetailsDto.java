package org.algocore.algocorebackend.dto.problem;

import lombok.Builder;
import lombok.Getter;
import org.algocore.algocorebackend.entity.ProblemDifficulty;
import org.algocore.algocorebackend.entity.SchoolGrade;

import java.util.UUID;

@Builder
@Getter
public class ProblemDetailsDto {
    private UUID id;
    private String title;
    private String description;
    private ProblemDifficulty difficulty;
    private SchoolGrade schoolGrade;
    private Boolean hasSolved;
}
