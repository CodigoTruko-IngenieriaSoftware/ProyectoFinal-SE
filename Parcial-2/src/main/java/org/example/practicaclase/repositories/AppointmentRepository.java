package org.example.practicaclase.repositories;

import org.example.practicaclase.domain.entities.Appointment;
import org.example.practicaclase.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    @Query("SELECT a FROM Appointment a JOIN a.users u WHERE u = :user")
    List<Appointment> findByUsers(User user);
}
