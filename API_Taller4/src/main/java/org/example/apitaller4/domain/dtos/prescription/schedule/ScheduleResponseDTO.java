package org.example.apitaller4.domain.dtos.prescription.schedule;

import lombok.Data;

import java.util.List;

@Data
public class ScheduleResponseDTO {
    private List<ScheduleAppointmentDTO> appointments;
}
