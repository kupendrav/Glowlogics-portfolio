package com.glowlogics.portfolio.dto;

import java.time.Instant;
import java.util.List;

public record ProjectResponse(
        Long id,
        String title,
        String description,
        String imageUrl,
        String liveDemoUrl,
        String githubUrl,
        String category,
        List<String> techStack,
        boolean featured,
        Instant createdAt,
        Instant updatedAt
) {
}
