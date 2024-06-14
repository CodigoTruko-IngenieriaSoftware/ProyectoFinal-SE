package org.example.apitaller4.repositories;

import org.example.apitaller4.domain.entities.Appointment;
import org.example.apitaller4.domain.entities.Attend;
import org.example.apitaller4.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AttendRepository extends JpaRepository<Attend, UUID> {
    List<Attend> findAttendsByUser(User user);
    Attend findAttendByUserAndAppointment(User user, Appointment appointment);
    @Query("SELECT a.user FROM Attend a WHERE a.appointment = :appointment")
    List<User> findAllUsersByAppointment(@Param("appointment") Appointment appointment);
}
