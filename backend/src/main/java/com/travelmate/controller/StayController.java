package com.travelmate.controller;

import com.travelmate.entity.City;
import com.travelmate.entity.Stay;
import com.travelmate.repository.CityRepository;
import com.travelmate.repository.StayRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stays")
public class StayController {

    private final StayRepository stayRepository;
    private final CityRepository cityRepository;

    public StayController(StayRepository stayRepository, CityRepository cityRepository) {
        this.stayRepository = stayRepository;
        this.cityRepository = cityRepository;
    }

    private Map<Long, String> getCityMap() {
        return cityRepository.findAll().stream()
                .collect(Collectors.toMap(City::getId, City::getName, (a, b) -> a));
    }

    private void attachCityNames(List<Stay> stays) {
        Map<Long, String> map = getCityMap();
        for (Stay s : stays) {
            if (s.getCityId() != null) {
                s.setCityName(map.getOrDefault(s.getCityId(), ""));
            }
        }
    }

    private void attachCityName(Stay stay) {
        if (stay != null && stay.getCityId() != null) {
            cityRepository.findById(stay.getCityId())
                    .ifPresent(c -> stay.setCityName(c.getName()));
        }
    }

    @GetMapping
    public List<Stay> getStays(
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort
    ) {
        String keyword = (search != null && !search.isBlank()) ? search.trim() : null;
        String t = (type != null && !type.isBlank() && !"ALL".equalsIgnoreCase(type)) ? type.trim() : null;

        List<Stay> list = stayRepository.searchStays(cityId, t, minPrice, maxPrice, keyword);
        attachCityNames(list);

        // Sorting
        if ("price_asc".equalsIgnoreCase(sort)) {
            list.sort((a, b) -> Double.compare(a.getPricePerNight() != null ? a.getPricePerNight() : 0.0,
                    b.getPricePerNight() != null ? b.getPricePerNight() : 0.0));
        } else if ("price_desc".equalsIgnoreCase(sort)) {
            list.sort((a, b) -> Double.compare(b.getPricePerNight() != null ? b.getPricePerNight() : 0.0,
                    a.getPricePerNight() != null ? a.getPricePerNight() : 0.0));
        } else if ("rating".equalsIgnoreCase(sort)) {
            list.sort((a, b) -> Double.compare(b.getRating() != null ? b.getRating() : 0.0,
                    a.getRating() != null ? a.getRating() : 0.0));
        }

        return list;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Stay> getStayById(@PathVariable Long id) {
        return stayRepository.findById(id)
                .map(stay -> {
                    attachCityName(stay);
                    return ResponseEntity.ok(stay);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/featured")
    public List<Stay> getFeaturedStays() {
        List<Stay> list = stayRepository.findByIsBudgetFriendlyTrue();
        attachCityNames(list);
        if (list.size() > 6) {
            return list.subList(0, 6);
        }
        return list;
    }

    @GetMapping("/city/{cityId}")
    public List<Stay> getStaysByCity(@PathVariable Long cityId) {
        List<Stay> list = stayRepository.findByCityId(cityId);
        attachCityNames(list);
        return list;
    }
}
