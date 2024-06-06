package org.example.practicaclase.services;

import org.example.practicaclase.domain.entities.Specialty;
import org.example.practicaclase.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface SpecialtyService {
    Specialty create(Specialty specialty);
    Specialty findById(UUID id);
    List<Specialty> findAll();
    void delete(UUID id);
    List<Specialty> findByUser(User user);
    void addUserToSpecialty(UUID specialtyId, UUID userId);
    void removeUserFromSpecialty(UUID specialtyId, UUID userId);
}