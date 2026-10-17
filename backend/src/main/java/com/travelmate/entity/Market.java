package com.travelmate.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "markets")
public class Market {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "city_id")
    private Long cityId;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    private String category = "LOCAL_BAZAAR"; // STREET_MARKETS, HANDICRAFTS, CLOTHING, SOUVENIRS, BAZAARS

    @Column(name = "famous_for", length = 255)
    private String famousFor;

    @Column(name = "price_level", length = 50)
    private String priceLevel = "BUDGET"; // BUDGET, MODERATE, PREMIUM

    @Column(length = 255)
    private String address;

    @Column(name = "opening_time", length = 20)
    private String openingTime = "10:00";

    @Column(name = "closing_time", length = 20)
    private String closingTime = "22:00";

    private Double latitude;
    private Double longitude;
    private Double rating = 4.5;

    @Column(name = "review_count")
    private Integer reviewCount = 180;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "map_url", length = 500)
    private String mapUrl;

    @Transient
    private String cityName;

    public Market() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCityId() {
        return cityId;
    }

    public void setCityId(Long cityId) {
        this.cityId = cityId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getFamousFor() {
        return famousFor;
    }

    public void setFamousFor(String famousFor) {
        this.famousFor = famousFor;
    }

    public String getPriceLevel() {
        return priceLevel;
    }

    public void setPriceLevel(String priceLevel) {
        this.priceLevel = priceLevel;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getOpeningTime() {
        return openingTime;
    }

    public void setOpeningTime(String openingTime) {
        this.openingTime = openingTime;
    }

    public String getClosingTime() {
        return closingTime;
    }

    public void setClosingTime(String closingTime) {
        this.closingTime = closingTime;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getMapUrl() {
        return mapUrl;
    }

    public void setMapUrl(String mapUrl) {
        this.mapUrl = mapUrl;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }
}
