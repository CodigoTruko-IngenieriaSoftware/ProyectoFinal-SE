package org.example.parcial2ncapas.domain.dtos.appointment;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.example.parcial2ncapas.domain.entities.User;

import java.time.LocalDateTime;

@Data
public class AppointmentCreateRequestDTO {
    @NotBlank
    private String dateTime;

    @NotBlank
    private String description;

    @NotBlank
    private String appointmentType;

    @NotBlank
    private String username;
}
