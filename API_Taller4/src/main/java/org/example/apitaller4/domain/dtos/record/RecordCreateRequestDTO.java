package org.example.apitaller4.domain.dtos.record;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RecordCreateRequestDTO {
    @NotBlank
    private String reason;

    @NotBlank
    private String username;
}