package org.example.apitaller4.repositories;

import org.example.apitaller4.domain.entities.Appointment;
import org.example.apitaller4.domain.entities.Prescription;
import org.example.apitaller4.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {
    List<Prescription> findByAppointment(Appointment appointment);
    List<Prescription> findAllPrescriptionsByAppointment_UserAndIssueDateAfter(User appointment_user, LocalDate issue_date);

}
