package com.travelmate.controller;

import com.travelmate.dto.PackingRequest.*;
import com.travelmate.entity.PackingItem;
import com.travelmate.entity.User;
import com.travelmate.repository.PackingItemRepository;
import com.travelmate.security.AuthHelper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/packing")
public class PackingController {

    private final PackingItemRepository packingItemRepository;
    private final AuthHelper authHelper;

    public PackingController(PackingItemRepository packingItemRepository, AuthHelper authHelper) {
        this.packingItemRepository = packingItemRepository;
        this.authHelper = authHelper;
    }

    private void seedDefaultItems(User user) {
        List<PackingItem> defaults = new ArrayList<>();
        // Documents
        defaults.add(new PackingItem(user, "DOCUMENTS", "Government ID / Passport / Visa", false, false));
        defaults.add(new PackingItem(user, "DOCUMENTS", "Hotel and flight/train booking printouts", false, false));
        defaults.add(new PackingItem(user, "DOCUMENTS", "Travel insurance policy card", false, false));
        defaults.add(new PackingItem(user, "DOCUMENTS", "Emergency contact numbers written down", false, false));

        // Electronics
        defaults.add(new PackingItem(user, "ELECTRONICS", "Phone charger and USB cables", false, false));
        defaults.add(new PackingItem(user, "ELECTRONICS", "Power bank (10,000+ mAh)", false, false));
        defaults.add(new PackingItem(user, "ELECTRONICS", "Universal adapter / extension plug", false, false));
        defaults.add(new PackingItem(user, "ELECTRONICS", "Earphones / noise-canceling headphones", false, false));

        // Clothes
        defaults.add(new PackingItem(user, "CLOTHES", "Weather-appropriate shirts and bottoms", false, false));
        defaults.add(new PackingItem(user, "CLOTHES", "Comfortable walking shoes & extra socks", false, false));
        defaults.add(new PackingItem(user, "CLOTHES", "Light jacket or sweater for AC buses/flights", false, false));
        defaults.add(new PackingItem(user, "CLOTHES", "Rain jacket / compact umbrella", false, false));

        // Toiletries
        defaults.add(new PackingItem(user, "TOILETRIES", "Toothbrush, toothpaste, and dental floss", false, false));
        defaults.add(new PackingItem(user, "TOILETRIES", "Sunscreen (SPF 50+) and lip balm", false, false));
        defaults.add(new PackingItem(user, "TOILETRIES", "Hand sanitizer and wet wipes", false, false));
        defaults.add(new PackingItem(user, "TOILETRIES", "Small shampoo and body wash kit", false, false));

        // Health & Essentials
        defaults.add(new PackingItem(user, "HEALTH", "Basic first aid: Band-aids, antiseptic cream", false, false));
        defaults.add(new PackingItem(user, "HEALTH", "Painkillers, antacid, and motion sickness pills", false, false));
        defaults.add(new PackingItem(user, "HEALTH", "Reusable water bottle", false, false));
        defaults.add(new PackingItem(user, "HEALTH", "Mosquito repellent spray/lotion", false, false));

        packingItemRepository.saveAll(defaults);
    }

    @GetMapping
    public ResponseEntity<?> getChecklist() {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
        }

        User user = userOpt.get();
        if (packingItemRepository.countByUserId(user.getId()) == 0) {
            seedDefaultItems(user);
        }

        return ResponseEntity.ok(packingItemRepository.findByUserIdOrderByCategoryAscIdAsc(user.getId()));
    }

    @PostMapping
    public ResponseEntity<?> addItem(@Valid @RequestBody CreateItem req) {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
        }

        User user = userOpt.get();
        String cat = (req.category() != null && !req.category().isBlank()) ? req.category().toUpperCase() : "ESSENTIALS";
        PackingItem item = new PackingItem(user, cat, req.itemText().trim(), false, true);
        return ResponseEntity.status(HttpStatus.CREATED).body(packingItemRepository.save(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> toggleItem(@PathVariable Long id, @RequestBody UpdateStatus req) {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
        }

        return packingItemRepository.findByIdAndUserId(id, userOpt.get().getId())
                .<ResponseEntity<?>>map(item -> {
                    if (req.isChecked() != null) {
                        item.setIsChecked(req.isChecked());
                    } else {
                        item.setIsChecked(!Boolean.TRUE.equals(item.getIsChecked()));
                    }
                    return ResponseEntity.ok(packingItemRepository.save(item));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Item not found.")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
        }

        return packingItemRepository.findByIdAndUserId(id, userOpt.get().getId())
                .<ResponseEntity<?>>map(item -> {
                    packingItemRepository.delete(item);
                    return ResponseEntity.ok(Map.of("message", "Item deleted"));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Item not found.")));
    }

    @PostMapping("/reset")
    @Transactional
    public ResponseEntity<?> resetChecklist() {
        var userOpt = authHelper.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Login required"));
        }

        User user = userOpt.get();
        packingItemRepository.deleteByUserId(user.getId());
        seedDefaultItems(user);
        return ResponseEntity.ok(packingItemRepository.findByUserIdOrderByCategoryAscIdAsc(user.getId()));
    }
}
