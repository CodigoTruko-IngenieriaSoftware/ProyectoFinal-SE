package org.example.practicaclase.services;

import org.example.practicaclase.domain.entities.Appointment;
import org.example.practicaclase.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface AppointmentService {
    Appointment create(Appointment info);
    Appointment findById(UUID id);
    List<Appointment> findAll();
    void delete(UUID id);
    List<Appointment> findByUser(User user);
    void addUsersToAppointment(UUID appointmentId, List<UUID> userIds);
    void removeUserFromAppointment(UUID appointmentId, UUID userId);
}