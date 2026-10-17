package com.travelmate.repository;

import com.travelmate.entity.Market;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketRepository extends JpaRepository<Market, Long> {

    List<Market> findByCityId(Long cityId);

    List<Market> findByCategoryIgnoreCase(String category);

    @Query("SELECT m FROM Market m WHERE " +
           "(:cityId IS NULL OR m.cityId = :cityId) AND " +
           "(:category IS NULL OR LOWER(m.category) = LOWER(:category)) AND " +
           "(:priceLevel IS NULL OR LOWER(m.priceLevel) = LOWER(:priceLevel)) AND " +
           "(:keyword IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(m.famousFor) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(m.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Market> searchMarkets(
            @Param("cityId") Long cityId,
            @Param("category") String category,
            @Param("priceLevel") String priceLevel,
            @Param("keyword") String keyword
    );
}
