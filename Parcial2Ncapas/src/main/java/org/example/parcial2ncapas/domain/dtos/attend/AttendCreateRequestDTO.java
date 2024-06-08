package org.example.parcial2ncapas.domain.dtos.attend;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AttendCreateRequestDTO {
    @NotBlank
    private String username;

    @NotBlank
    private String appointmentId;

    @NotBlank
    private String specialty;
}
