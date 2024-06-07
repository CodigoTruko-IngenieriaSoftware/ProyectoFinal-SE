package org.example.parcial2ncapas.services;

import org.example.parcial2ncapas.domain.entities.Specialty;
import org.example.parcial2ncapas.domain.entities.User;

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