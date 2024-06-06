package org.example.practicaclase.controllers;

import jakarta.validation.Valid;
import org.example.practicaclase.domain.dtos.GeneralResponse;
import org.example.practicaclase.domain.dtos.LoginDTO;
import org.example.practicaclase.domain.dtos.TokenDTO;
import org.example.practicaclase.domain.dtos.UserChangesDTO;
import org.example.practicaclase.domain.dtos.UserRegisterDTO;
import org.example.practicaclase.domain.entities.Token;
import org.example.practicaclase.domain.entities.User;
import org.example.practicaclase.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class    AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/register")
    public ResponseEntity<GeneralResponse> register(@RequestBody @Valid UserRegisterDTO info){
        User user = userService.findByUsernameOrEmail(info.getUsername(), info.getEmail());
        if(user != null){
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "User already exists");
        }

        userService.create(info);
        return GeneralResponse.getResponse(HttpStatus.CREATED, "User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<GeneralResponse> login(@RequestBody @Valid LoginDTO info, BindingResult validations) throws Exception {
        User user = userService.findByIdentifier(info.getIdentifier());
        if(user == null){
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "User not found");
        }

        if(!userService.checkPassword(user, info.getPassword()) || !userService.isActive(user)){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "User not found");
        }

        Token token = userService.registerToken(user);
        return GeneralResponse.getResponse(HttpStatus.OK, new TokenDTO(token));

    }



}
