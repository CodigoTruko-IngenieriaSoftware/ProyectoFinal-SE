package org.example.apitaller4.repositories;

import org.example.apitaller4.domain.entities.Record;
import org.example.apitaller4.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface RecordRepository extends JpaRepository<Record, UUID> {
    List<Record> findByUser(User user);
    List<Record> findByUserAndCreationDateBetween(User user, LocalDate creationDate, LocalDate creationDate2);


}
