package com.travelmate.repository;

import com.travelmate.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByUserIdOrderByStartDateAsc(Long userId);

    List<Trip> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Trip> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);
}
