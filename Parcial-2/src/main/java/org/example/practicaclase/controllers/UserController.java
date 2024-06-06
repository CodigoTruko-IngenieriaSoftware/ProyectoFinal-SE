package org.example.practicaclase.controllers;

import jakarta.validation.Valid;
import org.example.practicaclase.domain.dtos.ChangePasswordRequestDTO;
import org.example.practicaclase.domain.dtos.ChangeRoleRequestDTO;
import org.example.practicaclase.domain.dtos.GeneralResponse;
import org.example.practicaclase.domain.dtos.UserChangesDTO;
import org.example.practicaclase.domain.entities.User;
import org.example.practicaclase.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PatchMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal User user, @RequestBody ChangePasswordRequestDTO request) {
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


    @PostMapping("/change-roles")
    public ResponseEntity<GeneralResponse> changeRoles(@RequestBody @Valid ChangeRoleRequestDTO info){
        User user = userService.findByIdentifier(info.getIdentifier());
        if (user == null) {
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "User not found");
        }

        userService.changeRoles(user, info.getRoles());
        return  GeneralResponse.getResponse(HttpStatus.OK, "Roles changed successfully");
    }

    @PatchMapping("/toggle-active")
    public ResponseEntity<?> toggleActive(@RequestBody @Valid UserChangesDTO info) {
        String username = info.getUsername();

        User user = userService.findByIdentifier(username);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        userService.toggleEnable(username);

        return GeneralResponse.getResponse(HttpStatus.OK,"Toggle Active");
    }

}
