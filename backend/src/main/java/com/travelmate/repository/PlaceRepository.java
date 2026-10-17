package com.travelmate.repository;

import com.travelmate.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {

    List<Place> findByCityId(Long cityId);

    List<Place> findByCategoryIgnoreCase(String category);

    List<Place> findByCityIdAndCategoryIgnoreCase(Long cityId, String category);

    List<Place> findByIsPopularTrue();

    List<Place> findByIsTrendingTrue();

    @Query("SELECT p FROM Place p WHERE " +
           "(:cityId IS NULL OR p.cityId = :cityId) AND " +
           "(:category IS NULL OR LOWER(p.category) = LOWER(:category)) AND " +
           "(:maxBudget IS NULL OR p.entryFee <= :maxBudget) AND " +
           "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Place> searchPlaces(
            @Param("cityId") Long cityId,
            @Param("category") String category,
            @Param("maxBudget") Double maxBudget,
            @Param("keyword") String keyword
    );
}
