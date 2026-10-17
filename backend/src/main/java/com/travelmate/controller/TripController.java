package com.travelmate.controller;

import com.travelmate.dto.TripDto.*;
import com.travelmate.entity.ItineraryItem;
import com.travelmate.entity.Trip;
import com.travelmate.entity.User;
import com.travelmate.repository.ItineraryItemRepository;
import com.travelmate.repository.TripRepository;
import com.travelmate.security.AuthHelper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripRepository tripRepository;
    private final ItineraryItemRepository itineraryItemRepository;
    private final AuthHelper authHelper;

    public TripController(
            TripRepository tripRepository,
            ItineraryItemRepository itineraryItemRepository,
            AuthHelper authHelper
    ) {
        this.tripRepository = tripRepository;
        this.itineraryItemRepository = itineraryItemRepository;
        this.authHelper = authHelper;
    }

    @GetMapping
    public ResponseEntity<?> getMyTrips() {
        return authHelper.getCurrentUser()
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(tripRepository.findByUserIdOrderByStartDateAsc(user.getId())))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required")));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTripById(@PathVariable Long id) {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
        }

        return tripRepository.findByIdAndUserId(id, userOpt.get().getId())
                .<ResponseEntity<?>>map(trip -> {
                    // Itinerary items are eagerly loaded or ordered
                    return ResponseEntity.ok(trip);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Trip not found or access denied.")));
    }

    @PostMapping
    public ResponseEntity<?> createTrip(@Valid @RequestBody TripRequest req) {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
        }

        if (req.endDate().isBefore(req.startDate())) {
            return ResponseEntity.badRequest().body(Map.of("message", "End date cannot precede start date."));
        }

        User user = userOpt.get();
        Trip trip = new Trip();
        trip.setUser(user);
        trip.setTripName(req.tripName().trim());
        trip.setDestination(req.destination().trim());
        trip.setStartDate(req.startDate());
        trip.setEndDate(req.endDate());
        trip.setBudget(req.budget() != null ? Math.max(0.0, req.budget()) : 0.0);
        trip.setNotes(req.notes());

        Trip saved = tripRepository.save(trip);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrip(@PathVariable Long id, @Valid @RequestBody TripRequest req) {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
        }

        if (req.endDate().isBefore(req.startDate())) {
            return ResponseEntity.badRequest().body(Map.of("message", "End date cannot precede start date."));
        }

        return tripRepository.findByIdAndUserId(id, userOpt.get().getId())
                .<ResponseEntity<?>>map(trip -> {
                    trip.setTripName(req.tripName().trim());
                    trip.setDestination(req.destination().trim());
                    trip.setStartDate(req.startDate());
                    trip.setEndDate(req.endDate());
                    trip.setBudget(req.budget() != null ? Math.max(0.0, req.budget()) : 0.0);
                    trip.setNotes(req.notes());
                    return ResponseEntity.ok(tripRepository.save(trip));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Trip not found or access denied.")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id) {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
        }

        return tripRepository.findByIdAndUserId(id, userOpt.get().getId())
                .<ResponseEntity<?>>map(trip -> {
                    tripRepository.delete(trip);
                    return ResponseEntity.ok(Map.of("message", "Trip deleted successfully."));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Trip not found or access denied.")));
    }

    // --- ITINERARY ENDPOINTS ---

    @PostMapping("/{tripId}/itinerary")
    @Transactional
    public ResponseEntity<?> addItineraryItem(@PathVariable Long tripId, @Valid @RequestBody ItineraryItemRequest req) {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
        }

        return tripRepository.findByIdAndUserId(tripId, userOpt.get().getId())
                .<ResponseEntity<?>>map(trip -> {
                    ItineraryItem item = new ItineraryItem();
                    item.setTrip(trip);
                    item.setItemType(req.itemType() != null ? req.itemType().toUpperCase() : "PLACE");
                    item.setReferenceId(req.referenceId());
                    item.setPlaceId(req.placeId());
                    item.setTitle(req.title().trim());
                    item.setLocation(req.location());
                    item.setDayNumber(req.dayNumber() != null ? Math.max(1, req.dayNumber()) : 1);
                    item.setVisitDate(req.visitDate());
                    item.setStartTime(req.startTime() != null ? req.startTime() : "09:00");
                    item.setEndTime(req.endTime() != null ? req.endTime() : "11:00");
                    item.setEstimatedCost(req.estimatedCost() != null ? Math.max(0.0, req.estimatedCost()) : 0.0);
                    item.setNotes(req.notes());
                    item.setSequenceNo(req.sequenceNo() != null ? req.sequenceNo() : trip.getItineraryItems().size() + 1);

                    trip.addItineraryItem(item);
                    itineraryItemRepository.save(item);
                    return ResponseEntity.status(HttpStatus.CREATED).body(item);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Trip not found or access denied.")));
    }

    @PutMapping("/{tripId}/itinerary/{itemId}")
    @Transactional
    public ResponseEntity<?> updateItineraryItem(
            @PathVariable Long tripId,
            @PathVariable Long itemId,
            @RequestBody ItineraryItemRequest req
    ) {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
        }

        return tripRepository.findByIdAndUserId(tripId, userOpt.get().getId())
                .<ResponseEntity<?>>map(trip -> itineraryItemRepository.findByIdAndTripId(itemId, tripId)
                        .<ResponseEntity<?>>map(item -> {
                            if (req.title() != null && !req.title().isBlank()) item.setTitle(req.title().trim());
                            if (req.location() != null) item.setLocation(req.location());
                            if (req.dayNumber() != null) item.setDayNumber(Math.max(1, req.dayNumber()));
                            if (req.visitDate() != null) item.setVisitDate(req.visitDate());
                            if (req.startTime() != null) item.setStartTime(req.startTime());
                            if (req.endTime() != null) item.setEndTime(req.endTime());
                            if (req.estimatedCost() != null) item.setEstimatedCost(Math.max(0.0, req.estimatedCost()));
                            if (req.notes() != null) item.setNotes(req.notes());
                            if (req.sequenceNo() != null) item.setSequenceNo(req.sequenceNo());
                            return ResponseEntity.ok(itineraryItemRepository.save(item));
                        })
                        .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Itinerary item not found."))))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Trip not found or access denied.")));
    }

    @DeleteMapping("/{tripId}/itinerary/{itemId}")
    @Transactional
    public ResponseEntity<?> deleteItineraryItem(@PathVariable Long tripId, @PathVariable Long itemId) {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
        }

        return tripRepository.findByIdAndUserId(tripId, userOpt.get().getId())
                .<ResponseEntity<?>>map(trip -> itineraryItemRepository.findByIdAndTripId(itemId, tripId)
                        .<ResponseEntity<?>>map(item -> {
                            trip.removeItineraryItem(item);
                            itineraryItemRepository.delete(item);
                            return ResponseEntity.ok(Map.of("message", "Itinerary item removed."));
                        })
                        .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Itinerary item not found."))))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Trip not found or access denied.")));
    }
}
