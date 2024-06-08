package org.example.parcial2ncapas.services.impls;

import org.example.parcial2ncapas.domain.dtos.appointment.AppointmentValidateRequestDTO;
import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.Role;
import org.example.parcial2ncapas.domain.entities.User;
import org.example.parcial2ncapas.repositories.AppointmentRepository;
import org.example.parcial2ncapas.repositories.RoleRepository;
import org.example.parcial2ncapas.repositories.UserRepository;
import org.example.parcial2ncapas.services.AppointmentService;
import org.example.parcial2ncapas.services.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final RoleRepository roleRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, UserRepository userRepository, UserService userService, RoleRepository roleRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.roleRepository = roleRepository;
    }

    @Override
    public void create(User user) {
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setAuthorized(false);
        appointment.setPending(true);

        appointmentRepository.save(appointment);
    }

    @Override
    public void validate(Appointment appointment, AppointmentValidateRequestDTO info) {

        User user = userService.findByIdentifier(appointment.getUser().getUsername());

        List<Role> actual_roles = user.getRoles();

        List<String> roleNames = new ArrayList<>(actual_roles.stream()
                .filter(Objects::nonNull)  // Filtra objetos null
                .map(Role::getName)
                .filter(Objects::nonNull)  // Filtra nombres null
                .toList());

        roleNames.add("PTNT");

        userService.changeRoles(user, roleNames);


        appointment.setDescription(info.getDescription());
        appointment.setDateTime(LocalDateTime.parse(info.getDateTime()));
        appointment.setAppointmentType(info.getAppointmentType());
        appointment.setAuthorized(true);

        appointmentRepository.save(appointment);
    }

    @Override
    public void togglePending(Appointment appointment) {
        appointment.setPending(!appointment.getPending());
        appointmentRepository.save(appointment);
    }

    @Override
    public Appointment findById(UUID id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    @Override
    public List<Appointment> findAll() {
        return appointmentRepository.findAll();
    }

    @Override
    public void delete(UUID id) {
        appointmentRepository.deleteById(id);
    }

    @Override
    public List<Appointment> findByUser(User user) {
        return null;
    }

}
