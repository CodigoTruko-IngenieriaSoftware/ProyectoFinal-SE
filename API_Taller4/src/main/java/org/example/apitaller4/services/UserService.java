package org.example.apitaller4.services;

import org.example.apitaller4.domain.dtos.UserRegisterDTO;
import org.example.apitaller4.domain.entities.Appointment;
import org.example.apitaller4.domain.entities.Token;
import org.example.apitaller4.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface UserService {
    void create(UserRegisterDTO info);
    User findByUsernameOrEmail(String username, String email);
    User findByIdentifier(String identifier);

    User findById(UUID id);
    List<User> findAll();
    List<User> findAllByUsername(List<String> usernames);

    boolean checkPassword(User user, String password);
    boolean isActive(User username);
    void toggleEnable(String username);
    void toggleAvailable(String username);
    Token registerToken(User user) throws Exception;
    Boolean isTokenValid(User user, String token);
    void cleanTokens(User user) throws Exception;
    User findUserAuthenticated();
    void updatePassword(String identifier, String newPassword);

    void changeRoles(User user, List<String> roles);

    Boolean isUserAssignedToThisAppointment(User user, Appointment appointment);
}
