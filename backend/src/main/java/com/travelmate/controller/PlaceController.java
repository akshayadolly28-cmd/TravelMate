package com.travelmate.controller;

import com.travelmate.entity.City;
import com.travelmate.entity.Place;
import com.travelmate.repository.CityRepository;
import com.travelmate.repository.PlaceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/places")
public class PlaceController {

    private final PlaceRepository placeRepository;
    private final CityRepository cityRepository;

    public PlaceController(PlaceRepository placeRepository, CityRepository cityRepository) {
        this.placeRepository = placeRepository;
        this.cityRepository = cityRepository;
    }

    private Map<Long, String> getCityMap() {
        return cityRepository.findAll().stream()
                .collect(Collectors.toMap(City::getId, City::getName, (a, b) -> a));
    }

    private void attachCityNames(List<Place> places) {
        Map<Long, String> map = getCityMap();
        for (Place p : places) {
            if (p.getCityId() != null) {
                p.setCityName(map.getOrDefault(p.getCityId(), ""));
            }
        }
    }

    private void attachCityName(Place place) {
        if (place != null && place.getCityId() != null) {
            cityRepository.findById(place.getCityId())
                    .ifPresent(c -> place.setCityName(c.getName()));
        }
    }

    @GetMapping
    public List<Place> getPlaces(
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double maxBudget,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort
    ) {
        String keyword = (search != null && !search.isBlank()) ? search.trim() : null;
        String cat = (category != null && !category.isBlank() && !"ALL".equalsIgnoreCase(category)) ? category.trim() : null;

        List<Place> list = placeRepository.searchPlaces(cityId, cat, maxBudget, keyword);
        attachCityNames(list);

        // Sorting
        if ("name".equalsIgnoreCase(sort)) {
            list.sort(Comparator.comparing(Place::getName, String.CASE_INSENSITIVE_ORDER));
        } else if ("rating".equalsIgnoreCase(sort)) {
            list.sort((a, b) -> Double.compare(b.getRating() != null ? b.getRating() : 0.0,
                    a.getRating() != null ? a.getRating() : 0.0));
        } else if ("fee_asc".equalsIgnoreCase(sort)) {
            list.sort((a, b) -> Double.compare(a.getEntryFee() != null ? a.getEntryFee() : 0.0,
                    b.getEntryFee() != null ? b.getEntryFee() : 0.0));
        } else if ("fee_desc".equalsIgnoreCase(sort)) {
            list.sort((a, b) -> Double.compare(b.getEntryFee() != null ? b.getEntryFee() : 0.0,
                    a.getEntryFee() != null ? a.getEntryFee() : 0.0));
        }

        return list;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Place> getPlaceById(@PathVariable Long id) {
        return placeRepository.findById(id)
                .map(place -> {
                    attachCityName(place);
                    return ResponseEntity.ok(place);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/popular")
    public List<Place> getPopularPlaces() {
        List<Place> list = placeRepository.findByIsPopularTrue();
        attachCityNames(list);
        return list;
    }

    @GetMapping("/trending")
    public List<Place> getTrendingPlaces() {
        List<Place> list = placeRepository.findByIsTrendingTrue();
        attachCityNames(list);
        return list;
    }

    @GetMapping("/city/{cityId}")
    public List<Place> getPlacesByCity(@PathVariable Long cityId) {
        List<Place> list = placeRepository.findByCityId(cityId);
        attachCityNames(list);
        return list;
    }
}
