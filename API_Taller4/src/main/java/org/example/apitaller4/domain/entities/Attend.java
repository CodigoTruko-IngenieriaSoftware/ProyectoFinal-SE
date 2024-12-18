package org.example.apitaller4.domain.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "attends")
public class Attend {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonBackReference
    @ManyToOne(optional = false)
    private User user;

    @JsonBackReference
    @ManyToOne(optional = false)
    private Appointment appointment;

    @JsonBackReference
    @ManyToOne(optional = false)
    private Specialty specialty;


}
