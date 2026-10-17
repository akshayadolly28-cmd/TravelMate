package com.travelmate.repository;

import com.travelmate.entity.Stay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StayRepository extends JpaRepository<Stay, Long> {

    List<Stay> findByCityId(Long cityId);

    List<Stay> findByTypeIgnoreCase(String type);

    List<Stay> findByIsBudgetFriendlyTrue();

    @Query("SELECT s FROM Stay s WHERE " +
           "(:cityId IS NULL OR s.cityId = :cityId) AND " +
           "(:type IS NULL OR LOWER(s.type) = LOWER(:type)) AND " +
           "(:minPrice IS NULL OR s.pricePerNight >= :minPrice) AND " +
           "(:maxPrice IS NULL OR s.pricePerNight <= :maxPrice) AND " +
           "(:keyword IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.address) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Stay> searchStays(
            @Param("cityId") Long cityId,
            @Param("type") String type,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("keyword") String keyword
    );
}
