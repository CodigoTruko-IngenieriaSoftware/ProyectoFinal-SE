package org.example.practicaclase.domain.entities;



import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String date;
    private Date hour;
    private String details;
    private String state;

    @ManyToMany(mappedBy = "appointments")
    private List<User> users;

    @OneToMany(mappedBy = "appointment",  fetch = FetchType.LAZY)
    @JsonIgnore
    private List<PreRegistration> preRegistrations;
}

