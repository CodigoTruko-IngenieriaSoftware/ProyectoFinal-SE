package org.example.parcial2ncapas.domain.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Data
@Entity
@Table(name = "prescriptions")
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String dose;
    private String instructions;
    private LocalDate issueDate;

    @ManyToOne(optional = false)
    private Appointment appointment;

}
