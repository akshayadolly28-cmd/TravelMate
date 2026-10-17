package com.travelmate.repository;

import com.travelmate.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Favorite> findByUserIdAndItemTypeOrderByCreatedAtDesc(Long userId, String itemType);

    Optional<Favorite> findByUserIdAndItemTypeAndItemId(Long userId, String itemType, Long itemId);

    boolean existsByUserIdAndItemTypeAndItemId(Long userId, String itemType, Long itemId);

    void deleteByUserIdAndItemTypeAndItemId(Long userId, String itemType, Long itemId);

    long countByUserId(Long userId);
}
