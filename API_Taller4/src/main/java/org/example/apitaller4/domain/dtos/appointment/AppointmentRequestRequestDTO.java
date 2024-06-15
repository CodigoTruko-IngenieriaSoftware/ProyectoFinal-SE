package org.example.apitaller4.domain.dtos.appointment;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AppointmentRequestRequestDTO {
    @NotBlank
    private String date;

    @NotBlank
    private String reason;
}
