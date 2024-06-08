package org.example.parcial2ncapas.controllers;

import jakarta.validation.Valid;
import org.example.parcial2ncapas.domain.dtos.GeneralResponse;
import org.example.parcial2ncapas.domain.dtos.appointment.AppointmentTogglePendingDTO;
import org.example.parcial2ncapas.domain.dtos.appointment.AppointmentValidateRequestDTO;
import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.User;
import org.example.parcial2ncapas.services.AppointmentService;
import org.example.parcial2ncapas.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserService userService;

    public AppointmentController(AppointmentService appointmentService, UserService userService) {
        this.appointmentService = appointmentService;
        this.userService = userService;
    }

    @PostMapping("/validate")
    public ResponseEntity<GeneralResponse> createAppointment(@RequestBody @Valid AppointmentValidateRequestDTO info){

        Appointment appointment = appointmentService.findById(UUID.fromString(info.getAppointmentId()));

        if(appointment == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Appoint not found");
        }

        if(appointment.getAuthorized()){
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "Appoint already authorized");
        }

        appointmentService.validate(appointment, info);

        return GeneralResponse.getResponse(HttpStatus.OK, "Appointment validated");

    }

    @PostMapping("/toggle-pending")
    public ResponseEntity<GeneralResponse> togglePending(@RequestBody @Valid AppointmentTogglePendingDTO info) {

        Appointment appointment = appointmentService.findById(UUID.fromString(info.getAppointmentId()));

        if(appointment == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Appoint not found");
        }

        appointmentService.togglePending(appointment);
        return GeneralResponse.getResponse(HttpStatus.OK, "Appointment validated");
    }


    @PostMapping("/")
    public ResponseEntity<GeneralResponse> requestAppointment(@AuthenticationPrincipal User user){
        appointmentService.create(user);
        return GeneralResponse.getResponse(HttpStatus.OK, "Appointment requested");
    }

    @GetMapping("/")
    public ResponseEntity<GeneralResponse> getAll(){
        return GeneralResponse.getResponse(HttpStatus.OK, appointmentService.findAll());
    }

}
