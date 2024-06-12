package org.example.parcial2ncapas.domain.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "specialities")
public class Specialty {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;

    @JsonManagedReference
    @OneToMany(mappedBy = "specialty", fetch = FetchType.LAZY)
    private List<Attend> attends;
}
