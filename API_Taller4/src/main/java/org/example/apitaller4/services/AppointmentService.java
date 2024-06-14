package org.example.apitaller4.services;

import org.example.apitaller4.domain.dtos.appointment.AppointmentRequestRequestDTO;
import org.example.apitaller4.domain.dtos.appointment.AppointmentApproveRequestDTO;
import org.example.apitaller4.domain.dtos.appointment.AppointmentStartRequestDTO;
import org.example.apitaller4.domain.entities.Appointment;
import org.example.apitaller4.domain.entities.Attend;
import org.example.apitaller4.domain.entities.User;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AppointmentService {
    void create(User user, AppointmentRequestRequestDTO info);
    void approve(Appointment appointment, AppointmentApproveRequestDTO info);
    void start(Appointment appointment);
    void finish(Appointment appointment);

    Appointment findById(UUID id);
    List<Appointment> findAll();
    void delete(UUID id);
    List<Appointment> findAllByUserAndState(User user, String state);
    List<Appointment> findAllByUser(User user);
    List<Appointment> findAllByDateAndAttends(LocalDate date, List<Attend> attends);
}