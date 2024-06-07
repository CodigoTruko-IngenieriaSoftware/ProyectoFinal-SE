package org.example.parcial2ncapas.services;

import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.PreRegistration;

import java.util.List;
import java.util.UUID;

public interface PreRegistrationService {
    PreRegistration create(PreRegistration preRegistration);
    PreRegistration findById(UUID id);
    List<PreRegistration> findAll();
    void delete(UUID id);
    List<PreRegistration> findByAppointment(Appointment appointment);
    void linkToAppointment(UUID preRegistrationId, UUID appointmentId);
}