package org.example.apitaller4.controllers;

import jakarta.validation.Valid;
import org.example.apitaller4.domain.dtos.GeneralResponse;
import org.example.apitaller4.domain.dtos.appointment.*;
import org.example.apitaller4.domain.entities.Appointment;
import org.example.apitaller4.domain.entities.Specialty;
import org.example.apitaller4.domain.entities.User;
import org.example.apitaller4.services.AppointmentService;
import org.example.apitaller4.services.AttendService;
import org.example.apitaller4.services.SpecialtyService;
import org.example.apitaller4.services.UserService;
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

            if(!user.getAvailable()){
                return GeneralResponse.getResponse(HttpStatus.CONFLICT, "User is not available");
            }

            //verificar los 15 minutos de descanso
            if (!appointmentService.isValidDateAndHour(user, appointment.getDate(), info) )
                return GeneralResponse.getResponse(HttpStatus.CONFLICT, user.getUsername() + " is not free");


            Specialty specialty = specialtyService.findByName(user_specialty.get(1));
            if(specialty == null){
                return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Specialty not found");
            }
        }



        appointmentService.approve(appointment, info);
        return GeneralResponse.getResponse(HttpStatus.OK, "Appointment approve");

    }

    @PostMapping("/start")
    public ResponseEntity<GeneralResponse> startAppointment(@RequestBody @Valid AppointmentStartRequestDTO info) {
        Appointment appointment = appointmentService.findById(UUID.fromString(info.getAppointmentId()));

        if(appointment == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Appoint not found");
        }


        appointmentService.start(appointment);

        return GeneralResponse.getResponse(HttpStatus.OK, "Appointment started");

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
