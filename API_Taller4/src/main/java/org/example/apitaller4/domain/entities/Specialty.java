package org.example.apitaller4.domain.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

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
