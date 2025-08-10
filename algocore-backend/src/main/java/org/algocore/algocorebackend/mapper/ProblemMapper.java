package org.algocore.algocorebackend.mapper;

import lombok.RequiredArgsConstructor;
import org.algocore.algocorebackend.dto.problem.ProblemCreateRequest;
import org.algocore.algocorebackend.dto.problem.ProblemDetailsDto;
import org.algocore.algocorebackend.entity.Problem;
import org.algocore.algocorebackend.entity.TestCase;
import org.algocore.algocorebackend.repository.ProblemRepository;
import org.algocore.algocorebackend.repository.TestCaseRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProblemMapper {
    private final TestCasesMapper testCasesMapper;
    private final TestCaseRepository testCaseRepository;
    private final ProblemRepository problemRepository;

    public Problem problemCreateRequestToProblem(ProblemCreateRequest req) {
        Problem problem = Problem.builder()
                .title(req.title())
                .description(req.description())
                .difficulty(req.difficulty())
                .grade(req.grade())
//                .defaultLanguage(req.defaultLanguage())
                .build();
        Problem savedProblem = problemRepository.save(problem);

// Now map each TestCaseDto to an entity, link to the saved problem, and save
        List<TestCase> cases = req.testCases().stream()
                .map(tcDto -> TestCase.builder()
                        .problem(savedProblem)                       // ← link
                        .input(tcDto.input())
                        .expectedOutput(tcDto.expectedOutput())
                        .hidden(tcDto.isHidden())
                        .build())
                .collect(Collectors.toList());
        testCaseRepository.saveAll(cases);

// Optionally set them back on the problem for the response
        savedProblem.setTestCases(cases);
        cases.forEach(t -> t.setProblem(savedProblem));
        return savedProblem;
    }

    // languages
//        List<ProblemLanguage> langs = req.languages().stream()
//                .map(l -> ProblemLanguage.builder()
//                        .problem(problem)
//                        .language(l.language())
//                        .templateCode(l.templateCode())
//                        .build())
//                .collect(Collectors.toList());
//        problem.setLanguages(langs);
//        langs.forEach(pl -> pl.setProblem(problem)); // ensure bidirectional if needed


    /// /        List<TestCase> testCases = req.testCases().stream()
    /// /                .map(tc -> TestCase.builder()
    /// /                        .problem(problem)
    /// /                        .input(tc.input())
    /// /                        .expectedOutput(tc.expectedOutput())
    /// /                        .hidden(tc.hidden())
    /// /                        .build())
    /// /                .collect(Collectors.toList());
//        problem.setTestCases(testCases);
//        testCases.forEach(t -> t.setProblem(problem));
    public ProblemDetailsDto problemToProblemDetailsDto(Problem problem) {
        return ProblemDetailsDto.builder()
                .id(problem.getId())
                .title(problem.getTitle())
                .description(problem.getDescription())
                .difficulty(problem.getDifficulty())
                .schoolGrade(problem.getGrade())
                .hasSolved(false)
                .build();
    }

    public ProblemDetailsDto problemToProblemDetailsDto(Problem problem, boolean hasSolved) {
        return ProblemDetailsDto.builder()
                .id(problem.getId())
                .title(problem.getTitle())
                .description(problem.getDescription())
                .difficulty(problem.getDifficulty())
                .schoolGrade(problem.getGrade())
                .hasSolved(hasSolved)
                .build();
    }
}



