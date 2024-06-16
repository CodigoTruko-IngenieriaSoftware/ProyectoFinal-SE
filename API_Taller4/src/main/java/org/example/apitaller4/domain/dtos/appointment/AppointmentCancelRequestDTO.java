package org.example.apitaller4.domain.dtos.appointment;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AppointmentCancelRequestDTO {
    @NotBlank
    private String appointmentId;
}
