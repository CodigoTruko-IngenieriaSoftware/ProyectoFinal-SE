package org.example.parcial2ncapas.domain.dtos.appointment;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AppointmentValidateRequestDTO {
    @NotBlank
    private String appointmentId;

    @NotBlank
    private String dateTime;

    @NotBlank
    private String description;

    @NotBlank
    private String appointmentType;
}
