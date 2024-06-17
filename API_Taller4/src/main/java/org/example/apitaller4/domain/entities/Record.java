package org.example.apitaller4.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private LocalDate updateDate;

    @JsonIgnore
    @ManyToOne(optional = false)
    private User user;
}
