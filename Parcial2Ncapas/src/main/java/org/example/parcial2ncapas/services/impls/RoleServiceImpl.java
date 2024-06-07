package org.example.parcial2ncapas.services.impls;

import org.example.parcial2ncapas.domain.dtos.role.RoleCreateRequestDTO;
import org.example.parcial2ncapas.domain.entities.Role;
import org.example.parcial2ncapas.repositories.RoleRepository;
import org.example.parcial2ncapas.services.RoleService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void create(RoleCreateRequestDTO info) {
        Role role = new Role();
        role.setId(info.getId());
        role.setName(info.getName());
        roleRepository.save(role);
    }

    @Override
    public Role findById(String id) {
        return roleRepository.findById(id).orElse(null);
    }

    @Override
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

}
