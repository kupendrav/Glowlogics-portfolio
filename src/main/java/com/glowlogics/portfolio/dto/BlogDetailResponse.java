package com.glowlogics.portfolio.dto;

import java.time.Instant;
import java.util.List;

public record BlogDetailResponse(
        Long id,
        String title,
        String summary,
        String contentMarkdown,
        String coverImageUrl,
        List<String> tags,
        boolean published,
        Instant createdAt,
        Instant updatedAt
) {
}
