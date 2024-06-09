package org.example.parcial2ncapas.repositories;

import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findAllByUserAndState(User user, String state);
    List<Appointment> findAllByUser(User user);
}
