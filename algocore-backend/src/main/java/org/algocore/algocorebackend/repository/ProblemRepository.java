package org.algocore.algocorebackend.repository;

import org.algocore.algocorebackend.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, UUID> {
}
