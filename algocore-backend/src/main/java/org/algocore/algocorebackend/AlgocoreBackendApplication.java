package org.algocore.algocorebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@SpringBootApplication
public class AlgocoreBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlgocoreBackendApplication.class, args);
    }

}
