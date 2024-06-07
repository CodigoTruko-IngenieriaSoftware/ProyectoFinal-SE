package org.example.parcial2ncapas.services;

import org.example.parcial2ncapas.domain.dtos.UserRegisterDTO;
import org.example.parcial2ncapas.domain.entities.Token;
import org.example.parcial2ncapas.domain.entities.User;

import java.util.List;

public interface UserService {
    void create(UserRegisterDTO info);
    User findByUsernameOrEmail(String username, String email);
    User findByIdentifier(String identifier);
    List<User> findAll();
    boolean checkPassword(User user, String password);
    boolean isActive(User username);
    void toggleEnable(String username);
    Token registerToken(User user) throws Exception;
    Boolean isTokenValid(User user, String token);
    void cleanTokens(User user) throws Exception;
    User findUserAuthenticated();
    void updatePassword(String identifier, String newPassword);

    void changeRoles(User user, List<String> roles);
}

