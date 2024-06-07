package org.example.parcial2ncapas.domain.entities;



import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue (strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String date;
    private LocalDateTime dateTime;
    private String description;
    private String appointmentType;
    private String state;

    /* RELACIONES CON OTRAS TABLAS */
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private  User patient;

    @ManyToMany
    @JoinTable(
            name = "appointment_doctor",
            joinColumns = @JoinColumn(name = "appointment_id"),
            inverseJoinColumns = @JoinColumn(name = "doctor_id")
    )
    private List<User> doctors;


    @ManyToMany
    @JoinTable(
            name = "appointment_specialty",
            joinColumns = @JoinColumn(name = "appointment_id"),
            inverseJoinColumns = @JoinColumn(name = "specialty_id")
    )
    private List<Specialty> specialties;


    @OneToMany(mappedBy = "appointment", fetch = FetchType.LAZY)
    private List<Prescription> prescriptions;


}