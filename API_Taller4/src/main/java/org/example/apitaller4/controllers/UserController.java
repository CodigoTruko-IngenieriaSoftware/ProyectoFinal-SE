package org.example.apitaller4.controllers;

import jakarta.validation.Valid;
import org.example.apitaller4.domain.dtos.user.ChangeAvatarRequestDTO;
import org.example.apitaller4.domain.dtos.user.ChangePasswordRequestDTO;
import org.example.apitaller4.domain.dtos.GeneralResponse;
import org.example.apitaller4.domain.dtos.record.RecordCreateRequestDTO;
import org.example.apitaller4.domain.dtos.record.RecordSearchByDateRequestDTO;
import org.example.apitaller4.domain.dtos.user.UserInfoResponseDTO;
import org.example.apitaller4.domain.entities.Role;
import org.example.apitaller4.domain.entities.User;
import org.example.apitaller4.services.RecordService;
import org.example.apitaller4.services.RoleService;
import org.example.apitaller4.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasAuthority('ROLE_USER')")
public class UserController {
    private final UserService userService;
    private final RecordService recordService;
    private final RoleService roleService;

    public UserController(UserService userService, RecordService recordService, RoleService roleService) {
        this.userService = userService;
        this.recordService = recordService;
        this.roleService = roleService;
    }


    @GetMapping("/")
    public ResponseEntity<GeneralResponse> getInfo(@AuthenticationPrincipal User user) {
        if (user == null) {
            return GeneralResponse.getResponse(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        UserInfoResponseDTO responseDTO = new UserInfoResponseDTO();
        responseDTO.setUsername(user.getUsername());
        responseDTO.setEmail(user.getEmail());
        responseDTO.setRole(user.getRoles());
        responseDTO.setAvatar(user.getAvartar());
        return GeneralResponse.getResponse(HttpStatus.OK, responseDTO);
    }

    @GetMapping("/all-users")
    public ResponseEntity<GeneralResponse> getAll(@AuthenticationPrincipal User user) {
        return GeneralResponse.getResponse(HttpStatus.OK, userService.findAll());
    }

    @GetMapping("/all-patients")
    public ResponseEntity<GeneralResponse> getAllPatients(@AuthenticationPrincipal User user) {

        if (user == null) {
            return GeneralResponse.getResponse(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        Role role = roleService.findById("PTNT");

        if (role == null) {
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Role Not Found");
        }

        List<Role> roles = new ArrayList<>();
        roles.add(role);

        return GeneralResponse.getResponse(HttpStatus.OK, userService.findAllUsersByRole(roles));
    }


    @GetMapping("/all-doctors")
    public ResponseEntity<GeneralResponse> getAllDoctors(@AuthenticationPrincipal User user) {

        if (user == null) {
            return GeneralResponse.getResponse(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        Role role = roleService.findById("DCTR");

        if (role == null) {
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Role Not Found");
        }

        List<Role> roles = new ArrayList<>();
        roles.add(role);

        return GeneralResponse.getResponse(HttpStatus.OK, userService.findAllUsersByRole(roles));
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


    @PatchMapping("/change-avatar")
    public ResponseEntity<GeneralResponse> changeAvatar(@AuthenticationPrincipal User user, @RequestBody ChangeAvatarRequestDTO request) {
        try {
            userService.updateAvatar(user.getEmail(), request.getAvatar());
            return GeneralResponse.getResponse(HttpStatus.OK, "Avatar changed successfully");
        } catch (Exception e) {
            return GeneralResponse.getResponse(HttpStatus.EXPECTATION_FAILED, "Could not update avatar");
        }
    }

    @GetMapping("/record")
    public ResponseEntity<GeneralResponse> getMyRecord(@AuthenticationPrincipal User user, @ModelAttribute @Valid RecordSearchByDateRequestDTO info){

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
