package com.travelmate.controller;

import com.travelmate.dto.FavoriteRequest;
import com.travelmate.entity.Favorite;
import com.travelmate.entity.User;
import com.travelmate.repository.FavoriteRepository;
import com.travelmate.security.AuthHelper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;
    private final AuthHelper authHelper;

    public FavoriteController(FavoriteRepository favoriteRepository, AuthHelper authHelper) {
        this.favoriteRepository = favoriteRepository;
        this.authHelper = authHelper;
    }

    @GetMapping
    public ResponseEntity<?> getFavorites(@RequestParam(required = false) String type) {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
        }

        User user = userOpt.get();
        List<Favorite> list;
        if (type != null && !type.isBlank() && !"ALL".equalsIgnoreCase(type)) {
            list = favoriteRepository.findByUserIdAndItemTypeOrderByCreatedAtDesc(user.getId(), type.toUpperCase());
        } else {
            list = favoriteRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/ids")
    public ResponseEntity<?> getFavoriteKeys() {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<Favorite> list = favoriteRepository.findByUserIdOrderByCreatedAtDesc(userOpt.get().getId());
        List<String> keys = list.stream()
                .map(f -> f.getItemType() + ":" + f.getItemId())
                .collect(Collectors.toList());

        return ResponseEntity.ok(keys);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> addFavorite(@Valid @RequestBody FavoriteRequest req) {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
        }

        User user = userOpt.get();
        String itemType = req.itemType().toUpperCase();
        if (favoriteRepository.existsByUserIdAndItemTypeAndItemId(user.getId(), itemType, req.itemId())) {
            return ResponseEntity.ok(Map.of("message", "Already in favorites", "saved", true));
        }

        Favorite fav = new Favorite();
        fav.setUser(user);
        fav.setItemType(itemType);
        fav.setItemId(req.itemId());
        fav.setPlaceId("PLACE".equalsIgnoreCase(itemType) ? req.itemId() : null);
        fav.setTitle(req.title());
        fav.setSubtitle(req.subtitle());
        fav.setImageUrl(req.imageUrl());
        fav.setRating(req.rating());
        fav.setPriceInfo(req.priceInfo());
        fav.setCityName(req.cityName());

        Favorite saved = favoriteRepository.save(fav);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Saved to favorites",
                "saved", true,
                "favorite", saved
        ));
    }

    @PostMapping("/toggle")
    @Transactional
    public ResponseEntity<?> toggleFavorite(@Valid @RequestBody FavoriteRequest req) {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
        }

        User user = userOpt.get();
        String itemType = req.itemType().toUpperCase();
        var existing = favoriteRepository.findByUserIdAndItemTypeAndItemId(user.getId(), itemType, req.itemId());

        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            return ResponseEntity.ok(Map.of("message", "Removed from favorites", "saved", false));
        } else {
            Favorite fav = new Favorite();
            fav.setUser(user);
            fav.setItemType(itemType);
            fav.setItemId(req.itemId());
            fav.setPlaceId("PLACE".equalsIgnoreCase(itemType) ? req.itemId() : null);
            fav.setTitle(req.title());
            fav.setSubtitle(req.subtitle());
            fav.setImageUrl(req.imageUrl());
            fav.setRating(req.rating());
            fav.setPriceInfo(req.priceInfo());
            fav.setCityName(req.cityName());

            Favorite saved = favoriteRepository.save(fav);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Saved to favorites",
                    "saved", true,
                    "favorite", saved
            ));
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteFavorite(@PathVariable Long id) {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
        }

        return favoriteRepository.findById(id)
                .filter(f -> f.getUser().getId().equals(userOpt.get().getId()))
                .<ResponseEntity<?>>map(f -> {
                    favoriteRepository.delete(f);
                    return ResponseEntity.ok(Map.of("message", "Removed from favorites.", "saved", false));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Favorite not found.")));
    }
}
