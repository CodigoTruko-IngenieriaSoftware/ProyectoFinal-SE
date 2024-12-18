package org.example.apitaller4.controllers;

import jakarta.validation.Valid;
import org.example.apitaller4.domain.dtos.GeneralResponse;
import org.example.apitaller4.domain.dtos.auth.LoginDTO;
import org.example.apitaller4.domain.dtos.auth.TokenDTO;
import org.example.apitaller4.domain.dtos.auth.UserRegisterDTO;
import org.example.apitaller4.domain.entities.Token;
import org.example.apitaller4.domain.entities.User;
import org.example.apitaller4.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class    AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/register")
    public ResponseEntity<GeneralResponse> register(@RequestBody @Valid UserRegisterDTO info){
        if(userService.findByIdentifier(info.getEmail()) != null || userService.findByIdentifier(info.getUsername()) != null){
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "Email or Username already exists");
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
