package org.example.apitaller4.domain.dtos.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserChangesDTO {
    @NotBlank
    private String username;
}

