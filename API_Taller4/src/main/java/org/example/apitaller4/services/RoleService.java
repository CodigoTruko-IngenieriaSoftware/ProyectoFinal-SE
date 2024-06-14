package org.example.apitaller4.services;

import org.example.apitaller4.domain.dtos.role.RoleCreateRequestDTO;
import org.example.apitaller4.domain.entities.Role;

import java.util.List;

public interface RoleService {
    void create(RoleCreateRequestDTO info);
    Role findById(String id);
    List<Role> findAll();
}
