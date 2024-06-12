package org.example.parcial2ncapas.repositories;

import org.example.parcial2ncapas.domain.entities.Token;
import org.example.parcial2ncapas.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TokenRepository extends JpaRepository<Token, UUID> {
    List<Token> findByUserAndActive(User user, Boolean active);
}