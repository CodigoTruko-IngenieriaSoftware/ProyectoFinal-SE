package org.example.practicaclase.repositories;

import org.example.practicaclase.domain.entities.Specialty;
import org.example.practicaclase.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface SpecialtyRepository extends JpaRepository<Specialty, UUID> {
    @Query("SELECT a FROM Specialty a JOIN a.users u WHERE u = :user")
    List<Specialty> findByUsers(User user);
}
