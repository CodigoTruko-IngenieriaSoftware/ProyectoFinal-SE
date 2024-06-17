package org.example.apitaller4.controllers;

import jakarta.validation.Valid;
import org.example.apitaller4.domain.dtos.GeneralResponse;
import org.example.apitaller4.domain.dtos.appointment.AppointmentGetByStateRequestDTO;
import org.example.apitaller4.domain.dtos.record.RecordByUserResponseDTO;
import org.example.apitaller4.domain.dtos.record.RecordCreateRequestDTO;
import org.example.apitaller4.domain.dtos.record.RecordDeleteRequestDTO;
import org.example.apitaller4.domain.dtos.record.RecordUpdateRequestDTO;
import org.example.apitaller4.domain.entities.Record;
import org.example.apitaller4.domain.entities.User;
import org.example.apitaller4.services.RecordService;
import org.example.apitaller4.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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


    @PatchMapping("/")
    public ResponseEntity<GeneralResponse> updateRecord(@RequestBody @Valid RecordUpdateRequestDTO info){

        Record record = recordService.findById(UUID.fromString(info.getRecordId()));

        if (record == null) {
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Record not found");
        }

        recordService.update(record, info);
        return GeneralResponse.getResponse(HttpStatus.OK, "Record updated");
    }


    @DeleteMapping("/")
    public ResponseEntity<GeneralResponse> deleteRecord(@RequestBody @Valid RecordDeleteRequestDTO info){

        Record record = recordService.findById(UUID.fromString(info.getRecordId()));

        if (record == null) {
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Record not found");
        }

        recordService.delete(record.getId());
        return GeneralResponse.getResponse(HttpStatus.OK, "Record deleted");
    }


    @GetMapping("/{username}")
    public ResponseEntity<GeneralResponse> getRecordsByUser(@PathVariable String username) {

        User user = userService.findByIdentifier(username);
        if(user == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "User not found");
        }

        List<Record> tmpRecords = recordService.findByUser(user);

        RecordByUserResponseDTO recordByUser = new RecordByUserResponseDTO();
        recordByUser.setRecords(tmpRecords);
        recordByUser.setUsername(user.getUsername());

        return GeneralResponse.getResponse(HttpStatus.OK, recordByUser);
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
