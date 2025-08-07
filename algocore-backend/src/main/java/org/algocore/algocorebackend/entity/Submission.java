package org.algocore.algocorebackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {
    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // your existing User entity

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Lob
    @NotBlank
    @Column(nullable = false)
    private String code;

    @NotBlank
    @Column(nullable = false)
    private String language;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionResult result;

    @Lob
    private String stdout;

    @Lob
    private String stderr;

    private Long runtimeMs;
    private Long memoryKb;

    // for failed submissions
    private UUID failedTestCaseId;
    private String expectedOutput;
    private String actualOutput;

    @Column(nullable = false, updatable = false)
    private Instant submittedAt;

    @PrePersist
    private void prePersist() {
        submittedAt = Instant.now();
    }
}
