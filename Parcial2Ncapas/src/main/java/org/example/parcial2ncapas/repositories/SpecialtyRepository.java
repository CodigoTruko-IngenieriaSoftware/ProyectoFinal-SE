package org.example.parcial2ncapas.repositories;

import org.example.parcial2ncapas.domain.entities.Specialty;
import org.example.parcial2ncapas.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface SpecialtyRepository extends JpaRepository<Specialty, UUID> {
    @Query("SELECT a FROM Specialty a JOIN a.users u WHERE u = :user")
    List<Specialty> findByUsers(User user);
}
