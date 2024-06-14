package org.example.apitaller4.domain.dtos.prescription;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class PrescriptionCreateRequestDTO {
    @NotBlank
    private String appointmentId;

    @NotEmpty
    private List<List<String>> prescriptions;
}


