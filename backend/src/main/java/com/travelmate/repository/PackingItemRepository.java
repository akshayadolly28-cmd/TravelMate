package com.travelmate.repository;

import com.travelmate.entity.PackingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PackingItemRepository extends JpaRepository<PackingItem, Long> {

    List<PackingItem> findByUserIdOrderByCategoryAscIdAsc(Long userId);

    Optional<PackingItem> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);

    void deleteByUserId(Long userId);
}
