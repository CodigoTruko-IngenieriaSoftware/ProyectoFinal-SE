package org.example.apitaller4.domain.dtos.prescription.schedule;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ScheduleRequestDTO {
    @NotBlank
    private String date;
}
