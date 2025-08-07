package org.algocore.algocorebackend.integration;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.algocore.algocorebackend.dto.judge0.Judge0Response;
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
    private final ObjectMapper objectMapper;

    @Value("${judge0.url}")
    private String baseUrl;
    @Value("${judge0.rapidapi.host}")
    private String rapidApiHost;
    @Value("${judge0.rapidapi.key}")
    private String rapidApiKey;

    private static final String SUBMISSIONS_ENDPOINT = "/submissions?base64_encoded=false&wait=true&fields=*";
    private static final Map<String, Integer> LANGUAGE_IDS = Map.of(
            "java", 62,
            "python", 71,
            "cpp", 54
    );

    public Judge0Response run(String code, String language, String input) {
        int langId = resolveLanguageId(language);
        String uri = baseUrl + SUBMISSIONS_ENDPOINT;

        String jsonPayload = toJson(Map.of(
                "language_id", langId,
                "source_code", code,
                "stdin", input
        ));

        HttpEntity<String> entity = new HttpEntity<>(jsonPayload, buildHeaders());

        ResponseEntity<Judge0Response> response = restTemplate.exchange(uri, HttpMethod.POST, entity, Judge0Response.class);
        return response.getBody();
    }

    private int resolveLanguageId(String language) {
        return LANGUAGE_IDS.get(language.toLowerCase());
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        headers.set("x-rapidapi-host", rapidApiHost);
        headers.set("x-rapidapi-key", rapidApiKey);
        return headers;
    }

    private String toJson(Map<String, Object> payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize payload", e);
        }
    }
}

