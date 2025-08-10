package org.algocore.algocorebackend.dto.submission;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record SubmissionRequestDto(
    @NotBlank(message = "Code cannot be empty")
    String code,
    
    @NotBlank(message = "Language cannot be empty")
    @Pattern(regexp = "^(java|python|cpp)$", message = "Language must be one of: java, python, cpp")
    String language
) {
}
