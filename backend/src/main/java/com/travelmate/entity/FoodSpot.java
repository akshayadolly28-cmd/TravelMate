package com.travelmate.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "food_places")
public class FoodSpot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "city_id")
    private Long cityId;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "food_type", length = 50)
    private String foodType; // VEG, NON_VEG, BOTH

    @Column(length = 50)
    private String category = "STREET_FOOD"; // STREET_FOOD, RESTAURANT, CAFE, SWEETS

    @Column(name = "price_range", length = 50)
    private String priceRange = "₹₹"; // ₹, ₹₹, ₹₹₹

    @Column(name = "indicative_price")
    private Double indicativePrice = 150.0;

    @Column(name = "must_try_dish", length = 200)
    private String mustTryDish;

    @Column(length = 255)
    private String address;

    @Column(name = "opening_hours", length = 100)
    private String openingHours = "11:00 AM - 11:00 PM";

    private Double latitude;
    private Double longitude;
    private Double rating = 4.6;

    @Column(name = "review_count")
    private Integer reviewCount = 210;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Transient
    private String cityName;

    public FoodSpot() {
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

    public String getFoodType() {
        return foodType;
    }

    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriceRange() {
        return priceRange;
    }

    public void setPriceRange(String priceRange) {
        this.priceRange = priceRange;
    }

    public Double getIndicativePrice() {
        return indicativePrice;
    }

    public void setIndicativePrice(Double indicativePrice) {
        this.indicativePrice = indicativePrice;
    }

    public String getMustTryDish() {
        return mustTryDish;
    }

    public void setMustTryDish(String mustTryDish) {
        this.mustTryDish = mustTryDish;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getOpeningHours() {
        return openingHours;
    }

    public void setOpeningHours(String openingHours) {
        this.openingHours = openingHours;
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

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }
}
