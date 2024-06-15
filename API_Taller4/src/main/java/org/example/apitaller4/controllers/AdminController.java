package org.example.apitaller4.controllers;

import jakarta.validation.Valid;
import org.example.apitaller4.domain.dtos.ChangeRoleRequestDTO;
import org.example.apitaller4.domain.dtos.GeneralResponse;
import org.example.apitaller4.domain.dtos.UserChangesDTO;
import org.example.apitaller4.domain.entities.User;
import org.example.apitaller4.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/config")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
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


    @PatchMapping("/toggle-available")
    public ResponseEntity<?> toggleAvailable(@RequestBody @Valid UserChangesDTO info) {
        String username = info.getUsername();

        User user = userService.findByIdentifier(username);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        userService.toggleAvailable(username);

        return GeneralResponse.getResponse(HttpStatus.OK,"Toggle Available");
    }

}
