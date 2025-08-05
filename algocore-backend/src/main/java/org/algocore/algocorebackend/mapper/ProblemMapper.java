package org.algocore.algocorebackend.mapper;

import org.algocore.algocorebackend.dto.problem.ProblemCreateRequest;
import org.algocore.algocorebackend.dto.problem.ProblemDetailsDto;
import org.algocore.algocorebackend.entity.Problem;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class ProblemMapper {
    public Problem problemCreateRequestToProblem(ProblemCreateRequest req) {
        return Problem.builder()
                .title(req.title())
                .description(req.description())
                .difficulty(req.difficulty())
                .grade(req.grade())
                .build();
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


        ////        List<TestCase> testCases = req.testCases().stream()
        ////                .map(tc -> TestCase.builder()
        ////                        .problem(problem)
        ////                        .input(tc.input())
        ////                        .expectedOutput(tc.expectedOutput())
        ////                        .hidden(tc.hidden())
        ////                        .build())
        ////                .collect(Collectors.toList());
//        problem.setTestCases(testCases);
//        testCases.forEach(t -> t.setProblem(problem));

    }

    public ProblemDetailsDto problemToProblemDetailsDto(Problem problem) {
        return new ProblemDetailsDto(
                problem.getId(),
                problem.getTitle(),
                problem.getDescription(),
                problem.getDifficulty(),
                problem.getGrade()
//                langs
        );
    }

}
