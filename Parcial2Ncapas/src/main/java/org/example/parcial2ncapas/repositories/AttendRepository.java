package org.example.parcial2ncapas.repositories;

import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.Attend;
import org.example.parcial2ncapas.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AttendRepository extends JpaRepository<Attend, UUID> {
    List<Attend> findAttendsByUser(User user);
    Attend findAttendByUserAndAppointment(User user, Appointment appointment);
}
