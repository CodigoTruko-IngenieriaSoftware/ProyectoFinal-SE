package org.example.apitaller4.domain.dtos.prescription.schedule;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
public class ScheduleAppointmentDTO {
    private UUID appointmentId;
    private LocalTime appointmentEntryHour;
    private LocalTime appointmentEstimatedEndHour;
    private String appointmentState;
    private SchedulePatientDTO patient;
    private List<ScheduleDoctorDTO> doctors;
}
