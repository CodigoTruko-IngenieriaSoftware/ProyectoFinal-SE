package org.example.parcial2ncapas.domain.dtos.prescription;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import org.example.parcial2ncapas.domain.entities.Prescription;

import java.util.List;

@Data
public class PrescriptionCreateRequestDTO {
    @NotBlank
    private String appointmentId;

    @NotEmpty
    private List<List<String>> prescriptions;
}


