package com.glowlogics.portfolio.dto;

import java.time.Instant;
import java.util.List;

public record BlogSummaryResponse(
        Long id,
        String title,
        String summary,
        String coverImageUrl,
        List<String> tags,
        Instant createdAt
) {
}
