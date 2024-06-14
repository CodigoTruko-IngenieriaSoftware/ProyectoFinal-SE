package org.example.apitaller4.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "roles")
public class Role {
    @Id
    private String id;
    private String name;

    @JsonIgnore
    @ManyToMany(mappedBy = "roles")
    List<User> users;

}
