package org.example.apitaller4.domain.dtos.prescription;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PrescriptionGetByDateRequestDTO {
    @NotBlank
    private String issueDate;
}
