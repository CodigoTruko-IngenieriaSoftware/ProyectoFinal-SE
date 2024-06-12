package org.example.parcial2ncapas.domain.dtos.role;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RoleCreateRequestDTO {
    @NotBlank
    private String id;

    @NotBlank
    private String name;
}
