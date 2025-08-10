package org.algocore.algocorebackend.controller;

import lombok.RequiredArgsConstructor;
import org.algocore.algocorebackend.dto.auth.UserResponseDto;
import org.algocore.algocorebackend.entity.User;
import org.algocore.algocorebackend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController { // not in /auth so i can keep all /auth/** endpoints with permitAll
    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(authService.getCurrentUser(user));
    }
}
