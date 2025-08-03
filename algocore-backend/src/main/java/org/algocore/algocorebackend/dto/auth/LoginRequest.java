package org.algocore.algocorebackend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @Email(message = "Invalid email format")
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}