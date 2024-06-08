package org.example.parcial2ncapas.domain.dtos.record;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RecordSearchByDateRequestDTO {
    @NotBlank
    private String dateStart;

    @NotBlank
    private String dateEnd;
}
