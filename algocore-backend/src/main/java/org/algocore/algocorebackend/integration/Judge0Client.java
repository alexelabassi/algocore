package org.algocore.algocorebackend.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class Judge0Client {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;      // 1) inject this

    @Value("${judge0.url}")
    private String baseUrl;
    @Value("${judge0.rapidapi.host}")
    private String rapidApiHost;
    @Value("${judge0.rapidapi.key}")
    private String rapidApiKey;

    public record Response(
            String stdout,
            String stderr,
            String compile_output,
            Integer status_id,
            Double time,
            Integer memory,
            String token
    ) {
    }

    public Response run(String code, String language, String input) {
        Integer langId = Map.of(
                "java", 62,
                "python", 71,
                "cpp", 54
        ).get(language.toLowerCase());
        if (langId == null) throw new IllegalArgumentException("Unsupported language: " + language);

        String uri = baseUrl + "/submissions?base64_encoded=false&wait=true&fields=*";

        // 2) build your JSON payload
        Map<String, Object> payload = Map.of(
                "language_id", langId,
                "source_code", code,
                "stdin", input
        );
        try {
            String json = objectMapper.writeValueAsString(payload);

            // 3) force UTF-8 content type
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(
                    new MediaType("application", "json", StandardCharsets.UTF_8)
            );
            headers.set("x-rapidapi-host", rapidApiHost);
            headers.set("x-rapidapi-key", rapidApiKey);

            // 4) send the raw JSON string
            HttpEntity<String> entity = new HttpEntity<>(json, headers);

            // log the raw bytes exactly like curl
            System.out.println("▶︎ RAW JSON → " + json);

            ResponseEntity<Response> resp = restTemplate
                    .exchange(uri, HttpMethod.POST, entity, Response.class);
            System.out.println(resp.getBody());
            return resp.getBody();
        } catch (Exception e) {
            System.err.println("Error during Judge0 request: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }
}

