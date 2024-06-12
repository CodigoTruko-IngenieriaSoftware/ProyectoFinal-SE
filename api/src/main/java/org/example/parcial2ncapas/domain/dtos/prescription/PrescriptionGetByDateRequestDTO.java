package org.example.parcial2ncapas.domain.dtos.prescription;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PrescriptionGetByDateRequestDTO {
    @NotBlank
    private String issueDate;
}
