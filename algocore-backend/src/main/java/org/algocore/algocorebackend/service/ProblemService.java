package org.algocore.algocorebackend.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.algocore.algocorebackend.dto.problem.ProblemCreateRequest;
import org.algocore.algocorebackend.dto.problem.ProblemDetailsDto;
import org.algocore.algocorebackend.dto.submission.SubmissionRequestDto;
import org.algocore.algocorebackend.dto.submission.SubmissionResponseDto;
import org.algocore.algocorebackend.entity.Problem;
import org.algocore.algocorebackend.entity.User;
import org.algocore.algocorebackend.exception.PostNotFoundException;
import org.algocore.algocorebackend.mapper.ProblemMapper;
import org.algocore.algocorebackend.repository.ProblemRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ProblemService {
    private final ProblemRepository problemRepository;
    private final ProblemMapper problemMapper;
    private final SubmissionService submissionService;

    public ProblemService(ProblemRepository problemRepository, ProblemMapper problemMapper, SubmissionService submissionService) {
        this.problemRepository = problemRepository;
        this.problemMapper = problemMapper;
        this.submissionService = submissionService;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ProblemDetailsDto createProblem(ProblemCreateRequest request) {
        Problem problem = problemMapper.problemCreateRequestToProblem(request);

        Problem saved = problemRepository.save(problem);

        return problemMapper.problemToProblemDetailsDto(saved);
    }

    public List<ProblemDetailsDto> getAllProblems() {
        List<Problem> problems = problemRepository.findAll();
        return problems.stream()
                .map(problemMapper::problemToProblemDetailsDto)
                .toList();
    }
    public List<ProblemDetailsDto> getAllProblems(User user) {
        List<Problem> problems = problemRepository.findAll();
//        return problems.stream()
//                .map(problemMapper::problemToProblemDetailsDto)
//                .toList();
        return problems.stream()
                .map(problem -> problemMapper.problemToProblemDetailsDto(problem, submissionService.hasUserSolvedProblem(problem, user)))
                .toList();
    }

    public SubmissionResponseDto submitProblem(UUID problemId, SubmissionRequestDto req, User user) {
        return submissionService.submit(problemId, req, user);
    }

    public ProblemDetailsDto getProblemById(UUID problemId) {
        Problem problem = problemRepository.findById(problemId).orElseThrow(() -> new PostNotFoundException("Problem not found"));
        return problemMapper.problemToProblemDetailsDto(problem);
    }

    public ProblemDetailsDto getProblemById(UUID problemId, User user) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new PostNotFoundException("Problem not found"));
        boolean hasSolved = submissionService.hasUserSolvedProblem(problem, user);
        return problemMapper.problemToProblemDetailsDto(problem, hasSolved);
    }
}

