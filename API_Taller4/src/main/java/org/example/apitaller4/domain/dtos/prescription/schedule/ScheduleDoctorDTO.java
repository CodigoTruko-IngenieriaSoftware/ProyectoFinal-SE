package org.example.apitaller4.domain.dtos.prescription.schedule;

import lombok.Data;

import java.util.UUID;

@Data
public class ScheduleDoctorDTO {
    private UUID userId;
    private String username;
}
