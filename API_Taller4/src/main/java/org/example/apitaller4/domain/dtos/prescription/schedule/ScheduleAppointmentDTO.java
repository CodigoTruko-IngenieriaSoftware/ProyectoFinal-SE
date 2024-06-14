package org.example.apitaller4.domain.dtos.prescription.schedule;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ScheduleAppointmentDTO {
    private UUID appointmentId;
    private SchedulePatientDTO patient;
    private List<ScheduleDoctorDTO> doctors;
}
