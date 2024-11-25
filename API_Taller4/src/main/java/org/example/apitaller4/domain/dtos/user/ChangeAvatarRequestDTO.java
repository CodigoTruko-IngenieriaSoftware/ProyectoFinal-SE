package org.example.apitaller4.domain.dtos.user;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChangeAvatarRequestDTO {
    @NotNull
    private Integer avatar;
}
