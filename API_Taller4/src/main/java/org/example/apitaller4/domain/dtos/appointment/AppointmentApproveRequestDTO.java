package org.example.apitaller4.domain.dtos.appointment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class AppointmentApproveRequestDTO {
    @NotBlank
    private String appointmentId;
    @NotBlank
    private String entryHour;
    @NotBlank
    private String estimatedTimeMinutes;

    @NotEmpty
    private List<List<String>> user_specialty;
}
