package org.example.parcial2ncapas.repositories;

import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.PreRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PreRegistrationRepository extends JpaRepository<PreRegistration, UUID> {
    List<PreRegistration> findByAppointment(Appointment appointment);
}
