package org.example.parcial2ncapas.domain.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Entity
@Table(name = "records")
public class Record {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String reason;
    private LocalDate creationDate;

    @ManyToOne(optional = false)
    private User user;
}