package org.example.parcial2ncapas.domain.entities;



import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue (strategy = GenerationType.UUID)
    private UUID id;

    private LocalDate date;
    private LocalTime entryHour;
    private LocalTime endHour;
    private LocalTime estimatedEndHour;
    private String reason;
    private String state;
    private Boolean done;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_code")
    private User user;

    @JsonManagedReference
    @OneToMany(mappedBy = "appointment", fetch = FetchType.LAZY)
    private List<Attend> attends;

    @JsonIgnore
    @OneToMany(mappedBy = "appointment", fetch = FetchType.LAZY)
    private List<Prescription> prescriptions;


}