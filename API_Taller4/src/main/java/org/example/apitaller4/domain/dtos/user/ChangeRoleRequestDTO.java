package org.example.apitaller4.domain.dtos.user;

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
