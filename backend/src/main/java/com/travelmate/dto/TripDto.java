package com.travelmate.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class TripDto {

    public record TripRequest(
            @NotBlank(message = "Trip title is required")
            String tripName,

            @NotBlank(message = "Destination is required")
            String destination,

            @NotNull(message = "Start date is required")
            LocalDate startDate,

            @NotNull(message = "End date is required")
            LocalDate endDate,

            @DecimalMin(value = "0.0", message = "Budget cannot be negative")
            Double budget,

            String notes
    ) {}

    public record ItineraryItemRequest(
            Long placeId,
            Long referenceId,
            String itemType, // PLACE, STAY, FOOD, MARKET, CUSTOM
            @NotBlank(message = "Title is required")
            String title,
            String location,
            Integer dayNumber,
            LocalDate visitDate,
            String startTime,
            String endTime,
            Double estimatedCost,
            String notes,
            Integer sequenceNo
    ) {}
}
