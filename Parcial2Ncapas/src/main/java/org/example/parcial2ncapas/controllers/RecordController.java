package org.example.parcial2ncapas.controllers;

import jakarta.validation.Valid;
import org.example.parcial2ncapas.domain.dtos.GeneralResponse;
import org.example.parcial2ncapas.domain.dtos.prescription.PrescriptionCreateRequestDTO;
import org.example.parcial2ncapas.domain.dtos.record.RecordCreateRequestDTO;
import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.User;
import org.example.parcial2ncapas.services.RecordService;
import org.example.parcial2ncapas.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/record")
public class RecordController {

    private final UserService userService;
    private final RecordService recordService;

    public RecordController(UserService userService, RecordService recordService) {
        this.userService = userService;
        this.recordService = recordService;
    }

    @PostMapping("/")
    public ResponseEntity<GeneralResponse> createRecord(@RequestBody @Valid RecordCreateRequestDTO info){

        User user = userService.findByIdentifier(info.getUsername());

        if (user == null) {
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "User not found");
        }

        recordService.create(user, info);
        return GeneralResponse.getResponse(HttpStatus.OK, "Record created");
    }

    @GetMapping("/")
    public ResponseEntity<GeneralResponse> getAll(){
        return GeneralResponse.getResponse(HttpStatus.OK, recordService.findAll());
    }

    @GetMapping("/my")
    public ResponseEntity<GeneralResponse> getMyRecord(@AuthenticationPrincipal User user){
        return GeneralResponse.getResponse(HttpStatus.OK, recordService.findByUser(user));
    }

}
