package org.example.apitaller4.controllers;


import jakarta.validation.Valid;
import org.example.apitaller4.domain.dtos.GeneralResponse;
import org.example.apitaller4.domain.dtos.role.RoleCreateRequestDTO;
import org.example.apitaller4.domain.entities.Role;
import org.example.apitaller4.services.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/role")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping("/")
    public ResponseEntity<GeneralResponse> createRole(@RequestBody @Valid RoleCreateRequestDTO info){
        Role role = roleService.findById(info.getId());

        if(role != null){
            return GeneralResponse.getResponse(HttpStatus.CONFLICT, "Role already exists");
        }

        roleService.create(info);
        return GeneralResponse.getResponse(HttpStatus.CREATED, "Role registered successfully");
    }

    @GetMapping("/")
    public ResponseEntity<GeneralResponse> getAll(){
        return GeneralResponse.getResponse(HttpStatus.OK, roleService.findAll());
    }

}
