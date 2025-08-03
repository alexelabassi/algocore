package org.algocore.algocorebackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

//import io.swagger.v3.oas.annotations.Operation;

@RestController
public class HelloController {
    @GetMapping("/hello")
//    @Operation(summary = "Test endpoint", description = "Returns a simple hello world message")
    public String hello() {
        return "Hello world";
    }
}