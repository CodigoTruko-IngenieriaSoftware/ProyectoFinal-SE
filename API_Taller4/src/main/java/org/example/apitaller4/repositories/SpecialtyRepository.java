package org.example.apitaller4.repositories;

import org.example.apitaller4.domain.entities.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpecialtyRepository extends JpaRepository<Specialty, UUID> {
    Specialty findByName(String name);
    List<Specialty> findAllByNameIn(List<String> names);
}
