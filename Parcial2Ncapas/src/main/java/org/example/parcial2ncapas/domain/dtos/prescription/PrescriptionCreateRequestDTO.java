package org.example.parcial2ncapas.domain.dtos.prescription;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PrescriptionCreateRequestDTO {
    @NotBlank
    private String appointmentId;

    @NotBlank
    private String dose;

    @NotBlank
    private String instructions;
}
