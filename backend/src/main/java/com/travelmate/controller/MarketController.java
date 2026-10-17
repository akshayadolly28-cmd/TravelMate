package com.travelmate.controller;

import com.travelmate.entity.City;
import com.travelmate.entity.Market;
import com.travelmate.repository.CityRepository;
import com.travelmate.repository.MarketRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/markets")
public class MarketController {

    private final MarketRepository marketRepository;
    private final CityRepository cityRepository;

    public MarketController(MarketRepository marketRepository, CityRepository cityRepository) {
        this.marketRepository = marketRepository;
        this.cityRepository = cityRepository;
    }

    private Map<Long, String> getCityMap() {
        return cityRepository.findAll().stream()
                .collect(Collectors.toMap(City::getId, City::getName, (a, b) -> a));
    }

    private void attachCityNames(List<Market> list) {
        Map<Long, String> map = getCityMap();
        for (Market m : list) {
            if (m.getCityId() != null) {
                m.setCityName(map.getOrDefault(m.getCityId(), ""));
            }
        }
    }

    private void attachCityName(Market market) {
        if (market != null && market.getCityId() != null) {
            cityRepository.findById(market.getCityId())
                    .ifPresent(c -> market.setCityName(c.getName()));
        }
    }

    @GetMapping
    public List<Market> getMarkets(
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String priceLevel,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort
    ) {
        String keyword = (search != null && !search.isBlank()) ? search.trim() : null;
        String cat = (category != null && !category.isBlank() && !"ALL".equalsIgnoreCase(category)) ? category.trim() : null;
        String pl = (priceLevel != null && !priceLevel.isBlank() && !"ALL".equalsIgnoreCase(priceLevel)) ? priceLevel.trim() : null;

        List<Market> list = marketRepository.searchMarkets(cityId, cat, pl, keyword);
        attachCityNames(list);

        if ("rating".equalsIgnoreCase(sort)) {
            list.sort((a, b) -> Double.compare(b.getRating() != null ? b.getRating() : 0.0,
                    a.getRating() != null ? a.getRating() : 0.0));
        } else if ("name".equalsIgnoreCase(sort)) {
            list.sort(Comparator.comparing(Market::getName, String.CASE_INSENSITIVE_ORDER));
        }

        return list;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Market> getMarketById(@PathVariable Long id) {
        return marketRepository.findById(id)
                .map(market -> {
                    attachCityName(market);
                    return ResponseEntity.ok(market);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/featured")
    public List<Market> getFeaturedMarkets() {
        List<Market> list = marketRepository.findAll();
        attachCityNames(list);
        list.sort((a, b) -> Double.compare(b.getRating() != null ? b.getRating() : 0.0,
                a.getRating() != null ? a.getRating() : 0.0));
        if (list.size() > 6) {
            return list.subList(0, 6);
        }
        return list;
    }

    @GetMapping("/city/{cityId}")
    public List<Market> getMarketsByCity(@PathVariable Long cityId) {
        List<Market> list = marketRepository.findByCityId(cityId);
        attachCityNames(list);
        return list;
    }
}
