package com.glowlogics.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record BlogRequest(
        @NotBlank @Size(max = 180) String title,
        @NotBlank @Size(max = 500) String summary,
        @NotBlank @Size(max = 40000) String contentMarkdown,
        @Size(max = 500) String coverImageUrl,
        @NotEmpty List<@NotBlank @Size(max = 50) String> tags,
        boolean published
) {
}
