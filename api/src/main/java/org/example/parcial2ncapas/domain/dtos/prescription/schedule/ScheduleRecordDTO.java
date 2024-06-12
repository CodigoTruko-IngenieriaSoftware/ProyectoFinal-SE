package org.example.parcial2ncapas.domain.dtos.prescription.schedule;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class ScheduleRecordDTO {
    private UUID recordId;
    private String reason;
    private LocalDate date;
}
