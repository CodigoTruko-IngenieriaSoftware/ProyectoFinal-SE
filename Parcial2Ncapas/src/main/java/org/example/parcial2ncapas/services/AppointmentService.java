package org.example.parcial2ncapas.services;

import org.example.parcial2ncapas.domain.dtos.appointment.AppointmentRequestRequestDTO;
import org.example.parcial2ncapas.domain.dtos.appointment.AppointmentApproveRequestDTO;
import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface AppointmentService {
    void create(User user, AppointmentRequestRequestDTO info);
    void approve(Appointment appointment, AppointmentApproveRequestDTO info);
    void togglePending(Appointment appointment);
    void done(Appointment appointment);
    Integer countByUserAndDone(User user, Boolean done);
    List<Appointment> findAllByUserAndDone(User user, Boolean done);
    Appointment findById(UUID id);
    List<Appointment> findAll();
    void delete(UUID id);
    List<Appointment> findAllByUserAndState(User user, String state);
    List<Appointment> findAllByUser(User user);
}