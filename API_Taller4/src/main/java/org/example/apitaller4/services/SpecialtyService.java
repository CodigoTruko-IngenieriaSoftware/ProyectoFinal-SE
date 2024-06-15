package org.example.apitaller4.services;

import org.example.apitaller4.domain.dtos.specialty.SpecialtyCreateRequestDTO;
import org.example.apitaller4.domain.entities.Specialty;
import org.example.apitaller4.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface SpecialtyService {
    Specialty create(SpecialtyCreateRequestDTO info);
    Specialty findById(UUID id);
    Specialty findByName(String name);
    List<Specialty> findAll();
    List<Specialty> findAllByName(List<String> names);
    void delete(UUID id);
    List<Specialty> findByUser(User user);
    void addUserToSpecialty(UUID specialtyId, UUID userId);
    void removeUserFromSpecialty(UUID specialtyId, UUID userId);
}