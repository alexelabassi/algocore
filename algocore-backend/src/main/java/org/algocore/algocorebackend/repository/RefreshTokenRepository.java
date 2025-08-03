package org.algocore.algocorebackend.repository;

import org.algocore.algocorebackend.entity.RefreshToken;
import org.algocore.algocorebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByUser(User user);
}
