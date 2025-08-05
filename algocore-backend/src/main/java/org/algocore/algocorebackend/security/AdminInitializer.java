package org.algocore.algocorebackend.security;

import org.algocore.algocorebackend.entity.Role;
import org.algocore.algocorebackend.entity.User;
import org.algocore.algocorebackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.default-password:adminpass}")
    private String adminPassword;

    public AdminInitializer(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepo.findByEmail("admin@gmail.com").isEmpty()) {
            User admin = User.builder()
                    .email("admin@gmail.com")
                    .username("admin")
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .build();
            userRepo.save(admin);
        }
    }
}
