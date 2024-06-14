package org.example.apitaller4.services;

import org.example.apitaller4.domain.dtos.prescription.PrescriptionCreateRequestDTO;
import org.example.apitaller4.domain.entities.Appointment;
import org.example.apitaller4.domain.entities.Prescription;
import org.example.apitaller4.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface PrescriptionService {
    void create(Appointment appointment, PrescriptionCreateRequestDTO info);
    Prescription findById(UUID id);
    List<Prescription> findAll();
    List<Prescription> findAllByUser(User user);
    void delete(UUID id);
    List<Prescription> findByAppointment(Appointment appointment);
    void linkToAppointment(UUID preRegistrationId, UUID appointmentId);
}