package org.example.parcial2ncapas.controllers;

import org.example.parcial2ncapas.domain.dtos.ChangePasswordRequestDTO;
import org.example.parcial2ncapas.domain.dtos.GeneralResponse;
import org.example.parcial2ncapas.domain.entities.User;
import org.example.parcial2ncapas.services.UserService;
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

    public UserController(UserService userService) {
        this.userService = userService;
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




}
