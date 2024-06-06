package org.example.practicaclase.repositories;

import org.example.practicaclase.domain.entities.Record;
import org.example.practicaclase.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RecordRepository extends JpaRepository<Record, UUID> {
    List<Record> findByUser(User user);
}
