package org.example.parcial2ncapas.controllers;

import jakarta.validation.Valid;
import org.example.parcial2ncapas.domain.dtos.GeneralResponse;
import org.example.parcial2ncapas.domain.dtos.appointment.AppointmentCreateRequestDTO;
import org.example.parcial2ncapas.domain.dtos.attend.AttendCreateRequestDTO;
import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.Specialty;
import org.example.parcial2ncapas.domain.entities.User;
import org.example.parcial2ncapas.services.AppointmentService;
import org.example.parcial2ncapas.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserService userService;

    public AppointmentController(AppointmentService appointmentService, UserService userService) {
        this.appointmentService = appointmentService;
        this.userService = userService;
    }

    @PostMapping("/")
    public ResponseEntity<GeneralResponse> createAppointment(@RequestBody @Valid AppointmentCreateRequestDTO info){

        User user = userService.findByIdentifier(info.getUsername());
        if(user == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "User not found");
        }

        appointmentService.create(user, info);
        return GeneralResponse.getResponse(HttpStatus.OK, "Appointment created");

    }

    @GetMapping("/")
    public ResponseEntity<GeneralResponse> getAll(){
        return GeneralResponse.getResponse(HttpStatus.OK, appointmentService.findAll());
    }

}
