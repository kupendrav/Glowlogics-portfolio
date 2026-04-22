package com.glowlogics.portfolio.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record ProjectRequest(
        @NotBlank @Size(max = 120) String title,
        @NotBlank @Size(max = 2000) String description,
        @Size(max = 500) String imageUrl,
        @Size(max = 500) String liveDemoUrl,
        @Size(max = 500) String githubUrl,
        @NotBlank @Size(max = 60) String category,
        @NotEmpty List<@NotBlank @Size(max = 80) String> techStack,
        boolean featured
) {
}
