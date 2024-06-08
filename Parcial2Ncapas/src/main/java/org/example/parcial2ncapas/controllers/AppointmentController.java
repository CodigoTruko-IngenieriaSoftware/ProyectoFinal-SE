package org.example.parcial2ncapas.controllers;

import jakarta.validation.Valid;
import org.example.parcial2ncapas.domain.dtos.GeneralResponse;
import org.example.parcial2ncapas.domain.dtos.appointment.AppointmentAssistRequestDTO;
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

import java.util.List;
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

    @PatchMapping("/toggle-pending")
    public ResponseEntity<GeneralResponse> togglePending(@RequestBody @Valid AppointmentTogglePendingDTO info) {

        Appointment appointment = appointmentService.findById(UUID.fromString(info.getAppointmentId()));

        if(appointment == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Appoint not found");
        }

        appointmentService.togglePending(appointment);
        return GeneralResponse.getResponse(HttpStatus.OK, "Appointment validated");
    }

    @PostMapping("/assist")
    public ResponseEntity<GeneralResponse> assistToAppointment(@RequestBody @Valid AppointmentAssistRequestDTO info) {

        Appointment appointment = appointmentService.findById(UUID.fromString(info.getAppointmentId()));
        if(appointment == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Appoint not found");
        }

        if(!appointment.getAuthorized()){
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "Appoint not authorized");
        }

        if(appointment.getDone()) {
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "The appointment has already been made");
        }

        appointmentService.done(appointment);
        return GeneralResponse.getResponse(HttpStatus.OK, "Appointment assisted ");
    }

    @PostMapping("/")
    public ResponseEntity<GeneralResponse> requestAppointment(@AuthenticationPrincipal User user){

        List<Appointment> checkThisAppointment =  appointmentService.findAllByUserAndDone(user, false);

        if (!checkThisAppointment.isEmpty()) {
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "The user has a pending appointment");
        }

        appointmentService.create(user);
        return GeneralResponse.getResponse(HttpStatus.OK, "Appointment requested");
    }

    @GetMapping("/{username}/{done}")
    public ResponseEntity<GeneralResponse> getAll(@PathVariable String username, @PathVariable boolean done){
        User user = userService.findByIdentifier(username);
        if(user == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "User not found");
        }

        return GeneralResponse.getResponse(HttpStatus.OK, appointmentService.findAllByUserAndDone(user, done));
    }

    @GetMapping("/")
    public ResponseEntity<GeneralResponse> getAll(){
        return GeneralResponse.getResponse(HttpStatus.OK, appointmentService.findAll());
    }

}
