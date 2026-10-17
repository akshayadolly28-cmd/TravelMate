package com.travelmate.dto;

import jakarta.validation.constraints.NotBlank;

public class PackingRequest {

    public record CreateItem(
            String category,
            @NotBlank(message = "Item text is required")
            String itemText
    ) {}

    public record UpdateStatus(
            Boolean isChecked
    ) {}
}
