package com.vitacare.vitacare.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileWebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads}") // default to "uploads" if not set
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
        registry.addResourceHandler("/uploads/**")          // public URL
                .addResourceLocations(uploadPath.toUri().toString()); // portable path
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Only enable CORS for file uploads, let SecurityConfig handle /api/**
        registry.addMapping("/uploads/**")
                .allowedOriginPatterns("http://localhost:*") // flexible for dev ports
                .allowedMethods("GET", "POST")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
