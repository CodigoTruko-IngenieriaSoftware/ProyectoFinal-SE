package org.example.parcial2ncapas.domain.dtos.prescription.schedule;

import lombok.Data;
import org.example.parcial2ncapas.domain.entities.Appointment;

import java.util.List;

@Data
public class ScheduleResponseDTO {
    private List<ScheduleAppointmentDTO> appointments;
}
