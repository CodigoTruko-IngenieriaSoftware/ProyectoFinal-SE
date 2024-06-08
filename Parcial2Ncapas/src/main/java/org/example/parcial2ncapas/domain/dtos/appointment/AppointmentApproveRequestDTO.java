package org.example.parcial2ncapas.domain.dtos.appointment;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class AppointmentApproveRequestDTO {
    @NotBlank
    private String appointmentId;
    @NotBlank
    private String entryHour;
    @NotBlank
    private String estimatedTimeMinutes;
    private List<String> doctors;
    private List<String> specialties;
}
