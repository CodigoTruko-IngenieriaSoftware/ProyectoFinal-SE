package org.example.parcial2ncapas.repositories;

import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.Prescription;
import org.example.parcial2ncapas.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {
    List<Prescription> findByAppointment(Appointment appointment);
    @Query("SELECT p FROM Prescription p WHERE p.appointment IN :appointments AND p.issueDate > CURRENT_DATE")
    List<Prescription> findAllByAppointmentAndIssueDateAfterToday(List<Appointment> appointments);
}
