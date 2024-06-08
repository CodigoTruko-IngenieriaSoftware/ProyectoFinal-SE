package org.example.parcial2ncapas.domain.dtos.specialty;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SpecialtyCreateRequestDTO {
    @NotBlank
    private String name;
}
