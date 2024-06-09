package org.example.parcial2ncapas.services;


import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.Attend;
import org.example.parcial2ncapas.domain.entities.Specialty;
import org.example.parcial2ncapas.domain.entities.User;

import java.util.List;

public interface AttendService {
    void create(Appointment appointment, Specialty specialty, User user);
    List<Attend> findAll();
    List<Attend> findByUser(User user);
    List<User> findAllUsersByAppointment(Appointment appointment);
}
