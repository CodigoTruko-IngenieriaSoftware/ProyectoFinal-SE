package org.example.apitaller4.services;


import org.example.apitaller4.domain.entities.Appointment;
import org.example.apitaller4.domain.entities.Attend;
import org.example.apitaller4.domain.entities.Specialty;
import org.example.apitaller4.domain.entities.User;

import java.util.List;

public interface AttendService {
    void create(Appointment appointment, Specialty specialty, User user);
    List<Attend> findAll();
    List<Attend> findByUser(User user);
    List<User> findAllUsersByAppointment(Appointment appointment);
}
