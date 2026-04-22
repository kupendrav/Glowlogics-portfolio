package com.glowlogics.portfolio.dto;

import java.time.Instant;

public record ContactResponse(
        boolean success,
        String message,
        Instant submittedAt
) {
}
