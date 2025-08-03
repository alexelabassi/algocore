package org.algocore.algocorebackend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.algocore.algocorebackend.dto.auth.AuthResponse;
import org.algocore.algocorebackend.dto.auth.LoginRequest;
import org.algocore.algocorebackend.dto.auth.RefreshRequest;
import org.algocore.algocorebackend.dto.auth.RegisterRequest;
import org.algocore.algocorebackend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest req) {
        return ResponseEntity.ok(authService.refreshToken(req));
    }
}