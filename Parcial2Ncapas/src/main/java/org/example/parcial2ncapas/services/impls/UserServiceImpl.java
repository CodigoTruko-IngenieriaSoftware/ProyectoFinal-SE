package org.example.parcial2ncapas.services.impls;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.example.parcial2ncapas.domain.dtos.UserRegisterDTO;
import org.example.parcial2ncapas.domain.entities.*;
import org.example.parcial2ncapas.repositories.AttendRepository;
import org.example.parcial2ncapas.repositories.RoleRepository;
import org.example.parcial2ncapas.repositories.TokenRepository;
import org.example.parcial2ncapas.repositories.UserRepository;
import org.example.parcial2ncapas.services.UserService;
import org.example.parcial2ncapas.utils.JWTTools;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final JWTTools jwtTools;
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final AttendRepository attendRepository;

    public UserServiceImpl(UserRepository userRepository, JWTTools jwtTools, TokenRepository tokenRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository, AttendRepository attendRepository) {
        this.userRepository = userRepository;
        this.jwtTools = jwtTools;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.attendRepository = attendRepository;
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void create(UserRegisterDTO info){
        User user = new User();
        user.setUsername(info.getUsername());
        user.setPassword(passwordEncoder.encode(info.getPassword()));
        user.setEmail(info.getEmail());
        userRepository.save(user);
    }

    @Override
    public User findByUsernameOrEmail(String username, String email){
        return userRepository.findByUsernameOrEmail(username, email).orElse(null);
    }

    @Override
    public User findByIdentifier(String identifier){
        return userRepository.findByUsernameOrEmail(identifier, identifier).orElse(null);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public boolean checkPassword(User user, String password){
        return passwordEncoder.matches(password, user.getPassword());
    }

    @Override
    public boolean isActive(User user) {
        return user.getActive();
    }

    @Override
    public void toggleEnable(String username) {
        User user = userRepository.findByUsernameOrEmail(username, username).orElse(null);
        assert user != null;
        user.setActive(!user.getActive());
        userRepository.save(user);
    }

    @Override
    public void toggleAvailable(String username) {
        User user = userRepository.findByUsernameOrEmail(username, username).orElse(null);
        assert user != null;
        user.setAvailable(!user.getAvailable());
        userRepository.save(user);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public Token registerToken(User user) throws Exception {
        cleanTokens(user);

        String tokenString = jwtTools.generateToken(user);
        Token token = new Token(tokenString, user);

        tokenRepository.save(token);

        return token;
    }

    @Override
    public Boolean isTokenValid(User user, String token) {
        try {
            cleanTokens(user);
            List<Token> tokens = tokenRepository.findByUserAndActive(user, true);

            tokens.stream()
                    .filter(tk -> tk.getContent().equals(token))
                    .findAny()
                    .orElseThrow(() -> new Exception());

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void cleanTokens(User user) throws Exception {
        List<Token> tokens = tokenRepository.findByUserAndActive(user, true);

        tokens.forEach(token -> {
            if(!jwtTools.verifyToken(token.getContent())) {
                token.setActive(false);
                tokenRepository.save(token);
            }
        });

    }

    @Override
    public User findUserAuthenticated() {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsernameOrEmail(username, username).orElse(null);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void updatePassword(String identifier, String newPassword){
        User user = findByIdentifier(identifier);
        if (user == null) {
            throw new EntityNotFoundException("User not found with identifier: " + identifier);
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public void changeRoles(User user, List<String> roles) {
        List<Role> rolesFound = roleRepository.findAllById(roles);
        user.setRoles(rolesFound);
        userRepository.save(user);
    }


    @Override
    public Boolean isUserAssignedToThisAppointment(User user, Appointment appointment) {

        Attend attend = attendRepository.findAttendByUserAndAppointment(user, appointment);
        return attend != null;
    }

}
