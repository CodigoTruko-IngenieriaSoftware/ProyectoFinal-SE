package org.example.parcial2ncapas.domain.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserChangesDTO {
    @NotBlank
    private String username;
}

