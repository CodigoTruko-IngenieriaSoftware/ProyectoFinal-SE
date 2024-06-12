package org.example.parcial2ncapas.controllers;

import jakarta.validation.Valid;
import org.example.parcial2ncapas.domain.dtos.GeneralResponse;
import org.example.parcial2ncapas.domain.dtos.appointment.*;
import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.Attend;
import org.example.parcial2ncapas.domain.entities.Specialty;
import org.example.parcial2ncapas.domain.entities.User;
import org.example.parcial2ncapas.services.AppointmentService;
import org.example.parcial2ncapas.services.AttendService;
import org.example.parcial2ncapas.services.SpecialtyService;
import org.example.parcial2ncapas.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AttendService attendService;
    private final UserService userService;
    private final SpecialtyService specialtyService;

    public AppointmentController(AppointmentService appointmentService, AttendService attendService, UserService userService, SpecialtyService specialtyService) {
        this.appointmentService = appointmentService;
        this.attendService = attendService;
        this.userService = userService;
        this.specialtyService = specialtyService;
    }

    @PostMapping("/approve")
    public ResponseEntity<GeneralResponse> createAppointment(@RequestBody @Valid AppointmentApproveRequestDTO info){

        Appointment appointment = appointmentService.findById(UUID.fromString(info.getAppointmentId()));

        if(appointment == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Appoint not found");
        }

        if (Objects.equals(appointment.getState(), "pending_execution")){
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "Appointment already approve");
        }

        for (List<String> user_specialty : info.getUser_specialty()) {
            if (user_specialty.size() != 2) {
                return GeneralResponse.getResponse(HttpStatus.BAD_REQUEST, "User and Specialty does not match");
            }
            User user = userService.findByIdentifier(user_specialty.get(0));
            if(user == null){
                return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "User not found");
            }

            Specialty specialty = specialtyService.findByName(user_specialty.get(1));
            if(specialty == null){
                return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Specialty not found");
            }
        }

        appointmentService.approve(appointment, info);
        return GeneralResponse.getResponse(HttpStatus.OK, "Appointment validated");

    }

    @PostMapping("/finish")
    public ResponseEntity<GeneralResponse> finishAppointment(@AuthenticationPrincipal User user, @RequestBody @Valid AppointmentFinishRequestDTO info) {

        Appointment appointment = appointmentService.findById(UUID.fromString(info.getAppointmentId()));

        if (appointment == null) {
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Appoint not found");
        }

        if (Objects.equals(appointment.getState(), "finished")) {
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "Appointment already finished");
        }

        if(userService.isUserAssignedToThisAppointment(user, appointment)){
            appointmentService.finish(appointment);
            return GeneralResponse.getResponse(HttpStatus.OK, "Appointment finished");
        }

        return GeneralResponse.getResponse(HttpStatus.UNAUTHORIZED, "User not assigned to this appointment");

    }


    @PostMapping("/request")
    public ResponseEntity<GeneralResponse> requestAppointment(@AuthenticationPrincipal User user, @RequestBody @Valid AppointmentRequestRequestDTO info){

        if (user == null) {
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Your not logged");
        }

        appointmentService.create(user, info);
        return GeneralResponse.getResponse(HttpStatus.OK, "Appointment requested");
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
