package org.example.parcial2ncapas.domain.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "pre_registrations")
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String description;
    private String dose;
    private String instructions;
    private String issueDate;

    @ManyToOne(optional = false)
    private Appointment appointment;

}
