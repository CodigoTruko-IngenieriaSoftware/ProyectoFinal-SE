package org.example.parcial2ncapas.services.impls;

import jakarta.transaction.Transactional;
import org.example.parcial2ncapas.domain.dtos.specialty.SpecialtyCreateRequestDTO;
import org.example.parcial2ncapas.domain.entities.Specialty;
import org.example.parcial2ncapas.domain.entities.User;
import org.example.parcial2ncapas.repositories.SpecialtyRepository;
import org.example.parcial2ncapas.repositories.UserRepository;
import org.example.parcial2ncapas.services.SpecialtyService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SpecialtyServiceImpl implements SpecialtyService {

    private final SpecialtyRepository specialtyRepository;
    private final UserRepository userRepository;

    public SpecialtyServiceImpl(SpecialtyRepository specialtyRepository, UserRepository userRepository) {
        this.specialtyRepository = specialtyRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Specialty create(SpecialtyCreateRequestDTO info) {
        Specialty specialty = new Specialty();
        specialty.setName(info.getName());
        return specialtyRepository.save(specialty);
    }

    @Override
    public Specialty findById(UUID id) {
        return specialtyRepository.findById(id).orElse(null);
    }

    @Override
    public Specialty findByName(String name) {
        return specialtyRepository.findByName(name);
    }

    @Override
    public List<Specialty> findAll() {
        return specialtyRepository.findAll();
    }

    @Override
    public List<Specialty> findAllByName(List<String> names) {
        return specialtyRepository.findAllByNameIn(names);
    }

    @Override
    public void delete(UUID id) {
        specialtyRepository.deleteById(id);
    }

    @Override
    public List<Specialty> findByUser(User user) {
        return null;
    }

    @Override
    @Transactional
    public void addUserToSpecialty(UUID specialtyId, UUID userId) {
        Specialty specialty = findById(specialtyId);
        User user = userRepository.findById(userId).orElse(null);
        //specialty.getUsers().add(user);
        specialtyRepository.save(specialty);
    }

    @Override
    @Transactional
    public void removeUserFromSpecialty(UUID specialtyId, UUID userId) {
        Specialty specialty = findById(specialtyId);
        //specialty.getUsers().removeIf(u -> u.getId().equals(userId));
        specialtyRepository.save(specialty);
    }
}