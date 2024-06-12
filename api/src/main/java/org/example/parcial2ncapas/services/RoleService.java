package org.example.parcial2ncapas.services;

import org.example.parcial2ncapas.domain.dtos.role.RoleCreateRequestDTO;
import org.example.parcial2ncapas.domain.entities.Role;

import java.util.List;

public interface RoleService {
    void create(RoleCreateRequestDTO info);
    Role findById(String id);
    List<Role> findAll();
}
