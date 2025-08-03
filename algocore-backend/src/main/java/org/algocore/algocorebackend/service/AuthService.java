package org.algocore.algocorebackend.service;

import lombok.RequiredArgsConstructor;
import org.algocore.algocorebackend.dto.auth.AuthResponse;
import org.algocore.algocorebackend.dto.auth.LoginRequest;
import org.algocore.algocorebackend.dto.auth.RefreshRequest;
import org.algocore.algocorebackend.dto.auth.RegisterRequest;
import org.algocore.algocorebackend.entity.RefreshToken;
import org.algocore.algocorebackend.entity.Role;
import org.algocore.algocorebackend.entity.User;
import org.algocore.algocorebackend.exception.BadRequestException;
import org.algocore.algocorebackend.exception.UnauthorizedException;
import org.algocore.algocorebackend.repository.RefreshTokenRepository;
import org.algocore.algocorebackend.repository.UserRepository;
import org.algocore.algocorebackend.security.JwtProperties;
import org.algocore.algocorebackend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final RefreshTokenRepository refreshTokenRepo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final JwtProperties jwtProperties;

    public AuthResponse register(RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail().toLowerCase()).isPresent()) {
            throw new BadRequestException("Email already in use");
        }
        if (userRepo.findByUsername(req.getUsername().toLowerCase()).isPresent()) {
            throw new BadRequestException("Username already in use");
        }

        User user = User.builder()
                .email(req.getEmail().toLowerCase())
                .username(req.getUsername().toLowerCase())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(Role.USER)
                .build();

        userRepo.save(user);

        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        RefreshToken refreshToken = createRefreshToken(user);

        return new AuthResponse(accessToken, refreshToken.getToken());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        RefreshToken refreshToken = createRefreshToken(user);

        return new AuthResponse(accessToken, refreshToken.getToken());
    }

    public AuthResponse refreshToken(RefreshRequest request) {
        RefreshToken stored = refreshTokenRepo.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (stored.isExpired()) {
            refreshTokenRepo.deleteByUser(stored.getUser());
            throw new UnauthorizedException("Refresh token expired");
        }

        String accessToken = jwtUtil.generateAccessToken(stored.getUser().getEmail());
        // Optionally rotate refresh token:
        RefreshToken newRefresh = createRefreshToken(stored.getUser());
        refreshTokenRepo.delete(stored);

        return new AuthResponse(accessToken, newRefresh.getToken());
    }

    private RefreshToken createRefreshToken(User user) {
        // remove old
        refreshTokenRepo.deleteByUser(user);

        RefreshToken token = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiryDate(Instant.now().plusMillis(jwtProperties.getRefreshExpirationMs()))
                .build();
        return refreshTokenRepo.save(token);
    }
}