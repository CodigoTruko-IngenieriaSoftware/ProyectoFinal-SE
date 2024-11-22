package org.example.apitaller4.repositories;

import org.example.apitaller4.domain.entities.Appointment;
import org.example.apitaller4.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findAllByUserAndState(User user, String state);
    List<Appointment> findAllByUser(User user);
    @Query("SELECT a FROM Appointment a JOIN a.attends att WHERE a.date = :date AND att.id IN :attendIds")
    List<Appointment> findAllByDateAndAttendIds(@Param("date") LocalDate date, @Param("attendIds") List<UUID> attendIds);

    List<Appointment> findAllAppointmentsByDateAndEstimatedEndHourAfterAndEntryHourBefore(LocalDate date, LocalTime entryHour, LocalTime estimatedEndHour);

    List<Appointment> findAllAppointmentsByIdAndUser(UUID id, User user);

    @Query("SELECT a FROM Appointment a WHERE " +
            "a.user = :user AND a.state = :state AND " +
            "((a.date = :currentDate AND a.estimatedEndHour >= :currentTime) OR " +
            "(a.date = :nextDate AND a.entryHour < :nextTime))")
    List<Appointment> findAppointmentsByUserAndStateWithin24Hours(
            @Param("user") User user,
            @Param("state") String state,
            @Param("currentDate") LocalDate currentDate,
            @Param("currentTime") LocalTime currentTime,
            @Param("nextDate") LocalDate nextDate,
            @Param("nextTime") LocalTime nextTime
    );


}