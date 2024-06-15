package org.example.apitaller4.repositories;

import org.example.apitaller4.domain.entities.Token;
import org.example.apitaller4.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TokenRepository extends JpaRepository<Token, UUID> {
    List<Token> findByUserAndActive(User user, Boolean active);
}