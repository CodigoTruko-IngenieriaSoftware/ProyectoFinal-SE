package org.example.apitaller4.controllers;

import jakarta.validation.Valid;
import org.example.apitaller4.domain.dtos.ChangePasswordRequestDTO;
import org.example.apitaller4.domain.dtos.GeneralResponse;
import org.example.apitaller4.domain.dtos.record.RecordCreateRequestDTO;
import org.example.apitaller4.domain.dtos.record.RecordSearchByDateRequestDTO;
import org.example.apitaller4.domain.entities.User;
import org.example.apitaller4.services.RecordService;
import org.example.apitaller4.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasAuthority('ROLE_USER')")
public class UserController {
    private final UserService userService;
    private final RecordService recordService;

    public UserController(UserService userService, RecordService recordService) {
        this.userService = userService;
        this.recordService = recordService;
    }


    @GetMapping("/")
    public ResponseEntity<GeneralResponse> getAll(@AuthenticationPrincipal User user) {
        return GeneralResponse.getResponse(HttpStatus.OK, userService.findAll());
    }


    @PatchMapping("/change-password")
    public ResponseEntity<GeneralResponse> changePassword(@AuthenticationPrincipal User user, @RequestBody ChangePasswordRequestDTO request) {
        if (!userService.checkPassword(user, request.getOldPassword())) {
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "Current password is incorrect");
        }

        try {
            userService.updatePassword(user.getEmail(), request.getNewPassword());
            return GeneralResponse.getResponse(HttpStatus.OK, "Password changed successfully");
        } catch (Exception e) {
            return GeneralResponse.getResponse(HttpStatus.EXPECTATION_FAILED, "Could not update password");
        }
    }

    @GetMapping("/record")
    public ResponseEntity<GeneralResponse> getMyRecord(@AuthenticationPrincipal User user, @RequestBody @Valid RecordSearchByDateRequestDTO info){

        return GeneralResponse.getResponse(HttpStatus.OK, recordService.findByUserRangDate(user, info.getDateStart(), info.getDateEnd()));
    }



    @PostMapping("/record")
    public ResponseEntity<GeneralResponse> createRecord(@RequestBody @Valid RecordCreateRequestDTO info){

        User user = userService.findByIdentifier(info.getUsername());

        if (user == null) {
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "User not found");
        }

        recordService.create(user, info);
        return GeneralResponse.getResponse(HttpStatus.OK, "Record created");
    }


}
