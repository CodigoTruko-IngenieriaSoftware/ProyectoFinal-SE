package org.example.parcial2ncapas.controllers;

import jakarta.validation.Valid;
import org.example.parcial2ncapas.domain.dtos.GeneralResponse;
import org.example.parcial2ncapas.domain.dtos.appointment.*;
import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.Specialty;
import org.example.parcial2ncapas.domain.entities.User;
import org.example.parcial2ncapas.services.AppointmentService;
import org.example.parcial2ncapas.services.SpecialtyService;
import org.example.parcial2ncapas.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserService userService;
    private final SpecialtyService specialtyService;

    public AppointmentController(AppointmentService appointmentService, UserService userService, SpecialtyService specialtyService) {
        this.appointmentService = appointmentService;
        this.userService = userService;
        this.specialtyService = specialtyService;
    }

    @PostMapping("/approve")
    public ResponseEntity<GeneralResponse> createAppointment(@RequestBody @Valid AppointmentApproveRequestDTO info){

        Appointment appointment = appointmentService.findById(UUID.fromString(info.getAppointmentId()));

        if(appointment == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Appoint not found");
        }


        /*
        if(appointment.getState()){
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "Appoint already authorized");
        }




        List<String> doctorUsername = info.getUser_specialty().keySet().stream().toList();

        List<String> specialtiesNames = info.getUser_specialty().values().stream().toList();


        List<User> doctors = userService.findAllByUsername(doctorUsername);

        List<Specialty> specialties = specialtyService.findAllByName(specialtiesNames);

         */
        appointmentService.approve(appointment, info);



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

        /*
        if(!appointment.getState()){
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "Appoint not authorized");
        }

         */

        if(appointment.getDone()) {
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "The appointment has already been made");
        }

        appointmentService.done(appointment);
        return GeneralResponse.getResponse(HttpStatus.OK, "Appointment assisted ");
    }

    @PostMapping("/request")
    public ResponseEntity<GeneralResponse> requestAppointment(@AuthenticationPrincipal User user, @RequestBody @Valid AppointmentRequestRequestDTO info){

        if (user == null) {
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Your not logged");
        }

/*
        List<Appointment> checkThisAppointment =  appointmentService.findAllByUserAndDone(user, false);
        if (!checkThisAppointment.isEmpty()) {
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "The user has a pending appointment");
        }
 */

        appointmentService.create(user, info);
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

    @GetMapping("/own")
    public ResponseEntity<GeneralResponse> getAll(@AuthenticationPrincipal User user, @RequestBody @Valid AppointmentGetByStateRequestDTO info){
        if(info.getState() == null){
            return GeneralResponse.getResponse(HttpStatus.OK, appointmentService.findAllByUser(user));
        }
        return GeneralResponse.getResponse(HttpStatus.OK, appointmentService.findAllByUserAndState(user, info.getState()));
    }


    @GetMapping("/")
    public ResponseEntity<GeneralResponse> getAll(){
        return GeneralResponse.getResponse(HttpStatus.OK, appointmentService.findAll());
    }

}
