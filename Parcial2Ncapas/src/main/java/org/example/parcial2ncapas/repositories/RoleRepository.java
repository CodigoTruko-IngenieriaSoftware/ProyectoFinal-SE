package org.example.parcial2ncapas.repositories;

import org.example.parcial2ncapas.domain.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, String> {
    Role findByName(String name);
}
