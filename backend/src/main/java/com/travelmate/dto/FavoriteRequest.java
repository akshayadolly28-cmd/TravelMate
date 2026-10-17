package com.travelmate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FavoriteRequest(
        @NotBlank(message = "Item type is required (PLACE, STAY, FOOD, MARKET)")
        String itemType,

        @NotNull(message = "Item ID is required")
        Long itemId,

        String title,
        String subtitle,
        String imageUrl,
        Double rating,
        String priceInfo,
        String cityName
) {}
