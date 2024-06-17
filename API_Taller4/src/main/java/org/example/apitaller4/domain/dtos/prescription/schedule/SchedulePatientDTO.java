package org.example.apitaller4.domain.dtos.prescription.schedule;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class SchedulePatientDTO {
    private UUID patientId;
    private String patientUsername;
    private List<ScheduleRecordDTO> record;
}
