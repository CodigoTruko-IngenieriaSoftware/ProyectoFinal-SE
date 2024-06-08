package org.example.parcial2ncapas.services;

import org.example.parcial2ncapas.domain.dtos.prescription.PrescriptionCreateRequestDTO;
import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.Prescription;
import org.example.parcial2ncapas.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface PrescriptionService {
    Prescription create(Appointment appointment, PrescriptionCreateRequestDTO info);
    Prescription findById(UUID id);
    List<Prescription> findAll();
    void delete(UUID id);
    List<Prescription> findByAppointment(Appointment appointment);
    void linkToAppointment(UUID preRegistrationId, UUID appointmentId);
}