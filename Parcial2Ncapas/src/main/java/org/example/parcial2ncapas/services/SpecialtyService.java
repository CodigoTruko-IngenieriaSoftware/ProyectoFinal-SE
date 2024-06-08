package org.example.parcial2ncapas.services;

import org.example.parcial2ncapas.domain.dtos.specialty.SpecialtyCreateRequestDTO;
import org.example.parcial2ncapas.domain.entities.Specialty;
import org.example.parcial2ncapas.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface SpecialtyService {
    Specialty create(SpecialtyCreateRequestDTO info);
    Specialty findById(UUID id);
    Specialty findByName(String name);
    List<Specialty> findAll();
    void delete(UUID id);
    List<Specialty> findByUser(User user);
    void addUserToSpecialty(UUID specialtyId, UUID userId);
    void removeUserFromSpecialty(UUID specialtyId, UUID userId);
}