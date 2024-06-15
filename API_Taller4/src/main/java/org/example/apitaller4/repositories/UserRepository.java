package org.example.apitaller4.repositories;

import org.example.apitaller4.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsernameOrEmail(String username, String Email);
    List<User> findAllByUsernameIn(List<String> usernames);
}
