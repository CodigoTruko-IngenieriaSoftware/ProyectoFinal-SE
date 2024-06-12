package org.example.parcial2ncapas.domain.dtos.appointment;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AppointmentRequestRequestDTO {
    @NotBlank
    private String date;

    @NotBlank
    private String reason;
}
