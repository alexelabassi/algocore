package org.algocore.algocorebackend.repository;

import org.algocore.algocorebackend.entity.Problem;
import org.algocore.algocorebackend.entity.Submission;
import org.algocore.algocorebackend.entity.SubmissionResult;
import org.algocore.algocorebackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {
    boolean existsByProblemAndUserAndResult(Problem problem, User user, SubmissionResult result);

    Page<Submission> findByProblem_IdAndUser_Id(UUID problemId, UUID userId, Pageable pageable);

    Page<Submission> findByProblem_Id(UUID problemId, Pageable pageable);
    
    // Sorted methods for better user experience
    @Query("SELECT s FROM Submission s WHERE s.problem.id = :problemId ORDER BY s.submittedAt DESC")
    Page<Submission> findByProblem_IdOrderBySubmittedAtDesc(@Param("problemId") UUID problemId, Pageable pageable);
    
    @Query("SELECT s FROM Submission s WHERE s.problem.id = :problemId AND s.user.id = :userId ORDER BY s.submittedAt DESC")
    Page<Submission> findByProblem_IdAndUser_IdOrderBySubmittedAtDesc(@Param("problemId") UUID problemId, @Param("userId") UUID userId, Pageable pageable);
    
    // Statistics methods
    long countByProblem_Id(UUID problemId);
    
    long countByProblem_IdAndResult(UUID problemId, SubmissionResult result);
}
