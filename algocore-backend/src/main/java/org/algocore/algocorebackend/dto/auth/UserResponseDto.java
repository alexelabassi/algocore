package org.algocore.algocorebackend.dto.auth;

import org.algocore.algocorebackend.entity.Role;

import java.util.UUID;

public record UserResponseDto(
        UUID id,
        String email,
        String username,
        Role role
) {
}
