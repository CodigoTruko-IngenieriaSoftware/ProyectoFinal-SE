package org.example.parcial2ncapas.services;

import org.example.parcial2ncapas.domain.dtos.appointment.AppointmentCreateRequestDTO;
import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface AppointmentService {
    void create(User user, AppointmentCreateRequestDTO info);
    Appointment findById(UUID id);
    List<Appointment> findAll();
    void delete(UUID id);
    List<Appointment> findByUser(User user);
    void addUsersToAppointment(UUID appointmentId, List<UUID> userIds);
    void removeUserFromAppointment(UUID appointmentId, UUID userId);
}