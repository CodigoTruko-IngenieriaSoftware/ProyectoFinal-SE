package org.example.apitaller4.controllers;

import jakarta.validation.Valid;
import org.example.apitaller4.domain.dtos.GeneralResponse;
import org.example.apitaller4.domain.dtos.specialty.SpecialtyCreateRequestDTO;
import org.example.apitaller4.domain.entities.Specialty;
import org.example.apitaller4.services.SpecialtyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/specialty")
public class SpecialtyController {

    private final SpecialtyService specialtyService;

    public SpecialtyController(SpecialtyService specialtyService) {
        this.specialtyService = specialtyService;
    }

    @PostMapping("/")
    public ResponseEntity<GeneralResponse> createSpecialty(@RequestBody @Valid SpecialtyCreateRequestDTO info){
        Specialty specialty = specialtyService.findByName(info.getName());
        if(specialty != null){
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "Specialty already exists");
        }

        specialtyService.create(info);
        return GeneralResponse.getResponse(HttpStatus.OK, "Specialty created");
    }


    @GetMapping("/")
    public ResponseEntity<GeneralResponse> getAll(){
        return GeneralResponse.getResponse(HttpStatus.OK, specialtyService.findAll());
    }

}
