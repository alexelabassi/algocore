package org.algocore.algocorebackend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class AuthResponse {
    private final String accessToken;
    private final String refreshToken;
    private final String tokenType = "Bearer";
}