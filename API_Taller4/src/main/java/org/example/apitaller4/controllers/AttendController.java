package org.example.apitaller4.controllers;

import jakarta.validation.Valid;
import org.example.apitaller4.domain.dtos.GeneralResponse;
import org.example.apitaller4.domain.dtos.attend.AttendCreateRequestDTO;
import org.example.apitaller4.domain.entities.Appointment;
import org.example.apitaller4.domain.entities.Specialty;
import org.example.apitaller4.domain.entities.User;
import org.example.apitaller4.services.AppointmentService;
import org.example.apitaller4.services.AttendService;
import org.example.apitaller4.services.SpecialtyService;
import org.example.apitaller4.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/attend")
public class AttendController {

    private final UserService userService;
    private final SpecialtyService specialtyService;
    private final AppointmentService appointmentService;
    private final AttendService attendService;

    public AttendController(UserService userService, SpecialtyService specialtyService, AppointmentService appointmentService, AttendService attendService) {
        this.userService = userService;
        this.specialtyService = specialtyService;
        this.appointmentService = appointmentService;
        this.attendService = attendService;

    }

    @PostMapping("/")
    public ResponseEntity<GeneralResponse> createAttend(@RequestBody @Valid AttendCreateRequestDTO info){
        User user = userService.findByIdentifier(info.getUsername());
        if(user == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "User not found");
        }

        if(!user.getAvailable()){
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "User is not available");
        }


        Appointment appointment = appointmentService.findById(UUID.fromString(info.getAppointmentId()));

        if(appointment == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Appointment not found");
        }

        if(userService.isUserAssignedToThisAppointment(user, appointment)){
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "User already assigned to this appointment");
        }


        Specialty specialty = specialtyService.findByName(info.getSpecialty());

        if(specialty == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Specialty not found");
        }

        attendService.create(appointment, specialty, user);
        return GeneralResponse.getResponse(HttpStatus.OK, "Attend created");

    }

    @GetMapping("/")
    public ResponseEntity<GeneralResponse> getAll(){
        return GeneralResponse.getResponse(HttpStatus.OK, attendService.findAll());
    }

    @GetMapping("/{username}")
    public ResponseEntity<GeneralResponse> getAllByUsername(@PathVariable String username){
        User user = userService.findByIdentifier(username);
        if(user == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "User not found");
        }
        return GeneralResponse.getResponse(HttpStatus.OK, attendService.findByUser(user));
    }

}
