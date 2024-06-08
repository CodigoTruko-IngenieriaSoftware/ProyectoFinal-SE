package org.example.parcial2ncapas.controllers;

import jakarta.validation.Valid;
import org.example.parcial2ncapas.domain.dtos.GeneralResponse;
import org.example.parcial2ncapas.domain.dtos.prescription.PrescriptionCreateRequestDTO;
import org.example.parcial2ncapas.domain.dtos.prescription.PrescriptionSearchRequestDTO;
import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.Prescription;
import org.example.parcial2ncapas.domain.entities.User;
import org.example.parcial2ncapas.services.AppointmentService;
import org.example.parcial2ncapas.services.PrescriptionService;
import org.example.parcial2ncapas.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/prescription")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final AppointmentService appointmentService;
    private final UserService userService;

    public PrescriptionController(PrescriptionService prescriptionService, AppointmentService appointmentService, UserService userService) {
        this.prescriptionService = prescriptionService;
        this.appointmentService = appointmentService;
        this.userService = userService;
    }

    @PostMapping("/")
    public ResponseEntity<GeneralResponse> createPrescription(@AuthenticationPrincipal User user, @RequestBody @Valid PrescriptionCreateRequestDTO info){

        Appointment appointment = appointmentService.findById(UUID.fromString(info.getAppointmentId()));

        if(appointment == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Appointment not found");
        }

        if(userService.isUserAssignedToThisAppointment(user, appointment)){ //Verifica si el doctor esta asignado a esta cita, ya que solo el puede recetar
            prescriptionService.create(appointment, info);
            return GeneralResponse.getResponse(HttpStatus.OK, "Prescription created");
        }
        else{
            return GeneralResponse.getResponse(HttpStatus.FORBIDDEN, "User not assigned to this appointment");
        }

    }

    @GetMapping("/")
    public ResponseEntity<GeneralResponse> getAll(){
        return GeneralResponse.getResponse(HttpStatus.OK, prescriptionService.findAll());
    }

    @PostMapping("/search")
    public ResponseEntity<GeneralResponse> getAllByAppointment(@RequestBody @Valid PrescriptionSearchRequestDTO info){
        Appointment appointment = appointmentService.findById(UUID.fromString(info.getAppointmentId()));
        if(appointment == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Appointment not found");
        }

        return GeneralResponse.getResponse(HttpStatus.OK, prescriptionService.findByAppointment(appointment));
    }
}