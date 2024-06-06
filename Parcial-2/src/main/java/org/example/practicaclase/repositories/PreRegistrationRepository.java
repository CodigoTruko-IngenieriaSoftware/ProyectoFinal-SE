package org.example.practicaclase.repositories;

import org.example.practicaclase.domain.entities.Appointment;
import org.example.practicaclase.domain.entities.PreRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PreRegistrationRepository extends JpaRepository<PreRegistration, UUID> {
    List<PreRegistration> findByAppointment(Appointment appointment);
}
