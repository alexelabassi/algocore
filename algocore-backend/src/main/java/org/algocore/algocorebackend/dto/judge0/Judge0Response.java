package org.algocore.algocorebackend.dto.judge0;

public record Judge0Response(
        String stdout,
        String stderr,
        String compileOutput,
        Integer statusId,
        Double time,
        Integer memory,
        String token
) {
}