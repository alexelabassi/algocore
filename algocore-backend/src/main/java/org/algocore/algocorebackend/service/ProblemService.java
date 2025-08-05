package org.algocore.algocorebackend.service;

import org.algocore.algocorebackend.dto.problem.ProblemCreateRequest;
import org.algocore.algocorebackend.dto.problem.ProblemDetailsDto;
import org.algocore.algocorebackend.entity.Problem;
import org.algocore.algocorebackend.entity.TestCase;
import org.algocore.algocorebackend.mapper.ProblemMapper;
import org.algocore.algocorebackend.repository.ProblemRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProblemService {
    private final ProblemRepository problemRepository;
    private final ProblemMapper problemMapper;

    public ProblemService(ProblemRepository problemRepository, ProblemMapper problemMapper) {
        this.problemRepository = problemRepository;
        this.problemMapper = problemMapper;
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
}
