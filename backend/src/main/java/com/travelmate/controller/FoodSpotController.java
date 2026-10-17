package com.travelmate.controller;

import com.travelmate.entity.City;
import com.travelmate.entity.FoodSpot;
import com.travelmate.repository.CityRepository;
import com.travelmate.repository.FoodSpotRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/food")
public class FoodSpotController {

    private final FoodSpotRepository foodSpotRepository;
    private final CityRepository cityRepository;

    public FoodSpotController(FoodSpotRepository foodSpotRepository, CityRepository cityRepository) {
        this.foodSpotRepository = foodSpotRepository;
        this.cityRepository = cityRepository;
    }

    private Map<Long, String> getCityMap() {
        return cityRepository.findAll().stream()
                .collect(Collectors.toMap(City::getId, City::getName, (a, b) -> a));
    }

    private void attachCityNames(List<FoodSpot> list) {
        Map<Long, String> map = getCityMap();
        for (FoodSpot f : list) {
            if (f.getCityId() != null) {
                f.setCityName(map.getOrDefault(f.getCityId(), ""));
            }
        }
    }

    private void attachCityName(FoodSpot foodSpot) {
        if (foodSpot != null && foodSpot.getCityId() != null) {
            cityRepository.findById(foodSpot.getCityId())
                    .ifPresent(c -> foodSpot.setCityName(c.getName()));
        }
    }

    @GetMapping
    public List<FoodSpot> getFoodSpots(
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String foodType,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort
    ) {
        String keyword = (search != null && !search.isBlank()) ? search.trim() : null;
        String ft = (foodType != null && !foodType.isBlank() && !"ALL".equalsIgnoreCase(foodType)) ? foodType.trim() : null;
        String cat = (category != null && !category.isBlank() && !"ALL".equalsIgnoreCase(category)) ? category.trim() : null;

        List<FoodSpot> list = foodSpotRepository.searchFood(cityId, ft, cat, keyword);
        attachCityNames(list);

        if ("rating".equalsIgnoreCase(sort)) {
            list.sort((a, b) -> Double.compare(b.getRating() != null ? b.getRating() : 0.0,
                    a.getRating() != null ? a.getRating() : 0.0));
        } else if ("price_asc".equalsIgnoreCase(sort)) {
            list.sort((a, b) -> Double.compare(a.getIndicativePrice() != null ? a.getIndicativePrice() : 0.0,
                    b.getIndicativePrice() != null ? b.getIndicativePrice() : 0.0));
        } else if ("name".equalsIgnoreCase(sort)) {
            list.sort(Comparator.comparing(FoodSpot::getName, String.CASE_INSENSITIVE_ORDER));
        }

        return list;
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodSpot> getFoodSpotById(@PathVariable Long id) {
        return foodSpotRepository.findById(id)
                .map(food -> {
                    attachCityName(food);
                    return ResponseEntity.ok(food);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/featured")
    public List<FoodSpot> getFeaturedFood() {
        List<FoodSpot> list = foodSpotRepository.findAll();
        attachCityNames(list);
        list.sort((a, b) -> Double.compare(b.getRating() != null ? b.getRating() : 0.0,
                a.getRating() != null ? a.getRating() : 0.0));
        if (list.size() > 6) {
            return list.subList(0, 6);
        }
        return list;
    }

    @GetMapping("/city/{cityId}")
    public List<FoodSpot> getFoodByCity(@PathVariable Long cityId) {
        List<FoodSpot> list = foodSpotRepository.findByCityId(cityId);
        attachCityNames(list);
        return list;
    }
}
