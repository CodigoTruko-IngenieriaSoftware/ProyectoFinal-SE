package org.example.parcial2ncapas.domain.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "specialities")
public class Specialty {
    @Id
    private String id;

    private String name;

    @ManyToMany(mappedBy = "specialities")
    private List<User> users;
}
