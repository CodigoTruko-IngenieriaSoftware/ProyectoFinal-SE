package org.example.parcial2ncapas.domain.dtos.appointment;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AppointmentFinishRequestDTO {
    @NotBlank
    private String appointmentId;

}
