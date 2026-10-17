package com.travelmate.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/tools")
public class TravelToolsController {

    // Benchmark exchange rates relative to 1 INR
    private static final Map<String, Double> INR_RATES = new HashMap<>();

    static {
        INR_RATES.put("INR", 1.0);
        INR_RATES.put("USD", 86.50);
        INR_RATES.put("EUR", 92.20);
        INR_RATES.put("GBP", 109.80);
        INR_RATES.put("AED", 23.55);
        INR_RATES.put("SGD", 64.80);
        INR_RATES.put("JPY", 0.58);
        INR_RATES.put("THB", 2.52);
        INR_RATES.put("CAD", 62.10);
        INR_RATES.put("AUD", 56.40);
    }

    @GetMapping("/currency")
    public ResponseEntity<?> convertCurrency(
            @RequestParam(defaultValue = "1") Double amount,
            @RequestParam(defaultValue = "USD") String from,
            @RequestParam(defaultValue = "INR") String to
    ) {
        String fromUpper = from.toUpperCase().trim();
        String toUpper = to.toUpperCase().trim();

        if (!INR_RATES.containsKey(fromUpper) || !INR_RATES.containsKey(toUpper)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Unsupported currency code. Supported: " + INR_RATES.keySet()
            ));
        }

        double safeAmount = Math.max(0.0, amount);
        double fromRateInInr = INR_RATES.get(fromUpper);
        double toRateInInr = INR_RATES.get(toUpper);

        // Convert amount in 'from' to INR, then INR to 'to'
        double inInr = safeAmount * fromRateInInr;
        double converted = inInr / toRateInInr;
        double unitRate = fromRateInInr / toRateInInr;

        return ResponseEntity.ok(Map.of(
                "amount", safeAmount,
                "from", fromUpper,
                "to", toUpper,
                "convertedAmount", Math.round(converted * 100.0) / 100.0,
                "rate", Math.round(unitRate * 10000.0) / 10000.0,
                "timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")),
                "mode", "BENCHMARK_RATES",
                "note", "Indicative travel exchange rate. Live market fluctuations may vary at airport exchange counters."
        ));
    }

    @GetMapping("/weather")
    public ResponseEntity<?> getWeather(@RequestParam(defaultValue = "Hyderabad") String city) {
        String c = city.trim().toLowerCase();

        Map<String, Object> data = new HashMap<>();
        data.put("city", capitalize(city));
        data.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")));

        if (c.contains("goa")) {
            data.put("temperature", 30);
            data.put("feelsLike", 33);
            data.put("condition", "Sunny & Breezy");
            data.put("humidity", 72);
            data.put("windSpeed", 14);
            data.put("uvIndex", "Very High (8)");
            data.put("tip", "Great day for water sports and beach sunsets! Carry SPF 50 sunscreen and sunglasses.");
            data.put("icon", "Sun");
        } else if (c.contains("mumbai")) {
            data.put("temperature", 31);
            data.put("feelsLike", 35);
            data.put("condition", "Hazy Sunshine");
            data.put("humidity", 75);
            data.put("windSpeed", 12);
            data.put("uvIndex", "High (7)");
            data.put("tip", "Humid coastal weather. Evening strolls at Marine Drive are comfortable and breezy.");
            data.put("icon", "CloudSun");
        } else if (c.contains("jaipur")) {
            data.put("temperature", 28);
            data.put("feelsLike", 28);
            data.put("condition", "Clear Sky");
            data.put("humidity", 38);
            data.put("windSpeed", 9);
            data.put("uvIndex", "Moderate (6)");
            data.put("tip", "Pleasant daytime weather for sightseeing forts like Amber & Nahargarh. Light jacket recommended for night.");
            data.put("icon", "Sun");
        } else {
            // Hyderabad / default
            data.put("temperature", 29);
            data.put("feelsLike", 30);
            data.put("condition", "Partly Cloudy");
            data.put("humidity", 58);
            data.put("windSpeed", 10);
            data.put("uvIndex", "Moderate (6)");
            data.put("tip", "Ideal weather for exploring Golconda Fort and Charminar heritage walks.");
            data.put("icon", "Cloud");
        }

        return ResponseEntity.ok(data);
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
}
