package org.example.apitaller4.controllers;

import jakarta.validation.Valid;
import org.example.apitaller4.domain.dtos.GeneralResponse;
import org.example.apitaller4.domain.dtos.record.RecordCreateRequestDTO;
import org.example.apitaller4.domain.entities.User;
import org.example.apitaller4.services.RecordService;
import org.example.apitaller4.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
