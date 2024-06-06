package org.example.practicaclase.repositories;

import org.example.practicaclase.domain.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, String> {

}
