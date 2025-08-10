package org.algocore.algocorebackend.repository;

import org.algocore.algocorebackend.entity.Problem;
import org.algocore.algocorebackend.entity.Submission;
import org.algocore.algocorebackend.entity.SubmissionResult;
import org.algocore.algocorebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {
    boolean existsByProblemAndUserAndResult(Problem problem, User user, SubmissionResult result);
}
