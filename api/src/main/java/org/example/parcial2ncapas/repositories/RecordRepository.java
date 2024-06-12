package org.example.parcial2ncapas.repositories;

import org.example.parcial2ncapas.domain.entities.Record;
import org.example.parcial2ncapas.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface RecordRepository extends JpaRepository<Record, UUID> {
    List<Record> findByUser(User user);
    @Query("SELECT r FROM Record r WHERE r.user = :user AND r.creationDate BETWEEN :startDate AND :endDate")
    List<Record> findByUserAndDateBetween(@Param("user") User user,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);

}
