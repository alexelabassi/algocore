package org.algocore.algocorebackend.service;

import jakarta.transaction.Transactional;
import org.algocore.algocorebackend.dto.problem.ProblemCreateRequest;
import org.algocore.algocorebackend.dto.problem.ProblemDetailsDto;
import org.algocore.algocorebackend.dto.submission.SubmissionRequestDto;
import org.algocore.algocorebackend.dto.submission.SubmissionResponseDto;
import org.algocore.algocorebackend.dto.testcase.TestCaseRequestDto;
import org.algocore.algocorebackend.entity.Problem;
import org.algocore.algocorebackend.entity.TestCase;
import org.algocore.algocorebackend.entity.User;
import org.algocore.algocorebackend.exception.PostNotFoundException;
import org.algocore.algocorebackend.mapper.ProblemMapper;
import org.algocore.algocorebackend.repository.ProblemRepository;
import org.algocore.algocorebackend.repository.TestCaseRepository;
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
    private final TestCaseRepository testCaseRepository;

    public ProblemService(ProblemRepository problemRepository, ProblemMapper problemMapper, SubmissionService submissionService, TestCaseRepository testCaseRepository) {
        this.problemRepository = problemRepository;
        this.problemMapper = problemMapper;
        this.submissionService = submissionService;
        this.testCaseRepository = testCaseRepository;
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

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteProblem(UUID problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new PostNotFoundException("Problem not found"));
        
        // Log what will be deleted
        int submissionCount = problem.getSubmissions() != null ? problem.getSubmissions().size() : 0;
        int testCaseCount = problem.getTestCases() != null ? problem.getTestCases().size() : 0;
        
        System.out.println("Deleting problem: " + problem.getTitle());
        System.out.println("This will also delete " + submissionCount + " submissions and " + testCaseCount + " test cases");
        
        // Delete the problem (this will cascade to submissions and test cases)
        problemRepository.delete(problem);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public boolean hasSubmissions(UUID problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new PostNotFoundException("Problem not found"));
        return problem.getSubmissions() != null && !problem.getSubmissions().isEmpty();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<TestCaseRequestDto> getProblemTestCases(UUID problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new PostNotFoundException("Problem not found"));
        
        return problem.getTestCases().stream()
                .map(testCase -> new TestCaseRequestDto(
                        testCase.getInput(),
                        testCase.getExpectedOutput()
                ))
                .toList();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ProblemDetailsDto updateProblemTestCases(UUID problemId, List<TestCaseRequestDto> testCases) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new PostNotFoundException("Problem not found"));
        
        // Clear existing test cases
        problem.getTestCases().clear();
        
        // Add new test cases
        List<TestCase> newTestCases = testCases.stream()
                .map(tcDto -> TestCase.builder()
                        .problem(problem)
                        .input(tcDto.input())
                        .expectedOutput(tcDto.expectedOutput())
                        .build())
                .toList();
        
        problem.getTestCases().addAll(newTestCases);
        
        Problem savedProblem = problemRepository.save(problem);
        return problemMapper.problemToProblemDetailsDto(savedProblem);
    }
}

