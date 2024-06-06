package org.example.practicaclase.domain.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import java.util.List;


@Entity
@Table(name = "roles")
public class Role {
    @Id
    private String id;
    private String name;


    @ManyToMany(mappedBy = "roles")
    List<User> users;

}
