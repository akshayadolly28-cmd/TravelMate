package com.travelmate.repository;

import com.travelmate.entity.FoodSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodSpotRepository extends JpaRepository<FoodSpot, Long> {

    List<FoodSpot> findByCityId(Long cityId);

    List<FoodSpot> findByFoodTypeIgnoreCase(String foodType);

    @Query("SELECT f FROM FoodSpot f WHERE " +
           "(:cityId IS NULL OR f.cityId = :cityId) AND " +
           "(:foodType IS NULL OR LOWER(f.foodType) = LOWER(:foodType)) AND " +
           "(:category IS NULL OR LOWER(f.category) = LOWER(:category)) AND " +
           "(:keyword IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(f.mustTryDish) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(f.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<FoodSpot> searchFood(
            @Param("cityId") Long cityId,
            @Param("foodType") String foodType,
            @Param("category") String category,
            @Param("keyword") String keyword
    );
}
