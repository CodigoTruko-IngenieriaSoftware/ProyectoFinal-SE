package org.example.apitaller4.services.impls;

import org.example.apitaller4.domain.dtos.role.RoleCreateRequestDTO;
import org.example.apitaller4.domain.entities.Role;
import org.example.apitaller4.repositories.RoleRepository;
import org.example.apitaller4.services.RoleService;
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
