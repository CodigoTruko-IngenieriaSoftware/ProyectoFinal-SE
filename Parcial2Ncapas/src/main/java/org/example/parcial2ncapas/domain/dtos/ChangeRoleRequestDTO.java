package org.example.parcial2ncapas.domain.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ChangeRoleRequestDTO {
    @NotBlank
    private String identifier;

    @NotNull
    private List<String> roles;
}
