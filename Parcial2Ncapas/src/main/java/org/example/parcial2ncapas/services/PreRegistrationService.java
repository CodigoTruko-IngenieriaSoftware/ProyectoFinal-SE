package org.example.parcial2ncapas.services;

import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.Prescription;

import java.util.List;
import java.util.UUID;

public interface PreRegistrationService {
    Prescription create(Prescription prescription);
    Prescription findById(UUID id);
    List<Prescription> findAll();
    void delete(UUID id);
    List<Prescription> findByAppointment(Appointment appointment);
    void linkToAppointment(UUID preRegistrationId, UUID appointmentId);
}