package org.example.parcial2ncapas.services.impls;

import jakarta.validation.constraints.Null;
import org.example.parcial2ncapas.domain.dtos.appointment.AppointmentRequestRequestDTO;
import org.example.parcial2ncapas.domain.dtos.appointment.AppointmentApproveRequestDTO;
import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.Role;
import org.example.parcial2ncapas.domain.entities.Specialty;
import org.example.parcial2ncapas.domain.entities.User;
import org.example.parcial2ncapas.repositories.AppointmentRepository;
import org.example.parcial2ncapas.repositories.RoleRepository;
import org.example.parcial2ncapas.services.AppointmentService;
import org.example.parcial2ncapas.services.AttendService;
import org.example.parcial2ncapas.services.SpecialtyService;
import org.example.parcial2ncapas.services.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserService userService;
    private final AttendService attendService;
    private final SpecialtyService specialtyService;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, UserService userService, AttendService attendService, SpecialtyService specialtyService) {
        this.appointmentRepository = appointmentRepository;
        this.userService = userService;
        this.attendService = attendService;
        this.specialtyService = specialtyService;
    }

    @Override
    public void create(User user, AppointmentRequestRequestDTO info) {
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setState("pending_approval");
        appointment.setDate(LocalDate.parse(info.getDate()));
        appointment.setReason(info.getReason());

        appointmentRepository.save(appointment);
    }

    @Override
    public void approve(Appointment appointment, AppointmentApproveRequestDTO info) {

        User user = userService.findByIdentifier(appointment.getUser().getUsername());

        List<Role> actual_roles = user.getRoles();

        List<String> roleNames = new ArrayList<>(actual_roles.stream()
                .filter(Objects::nonNull)  // Filtra objetos null
                .map(Role::getName)
                .filter(Objects::nonNull)  // Filtra nombres null
                .toList());

        roleNames.add("PTNT");

        userService.changeRoles(user, roleNames);



        appointment.setState("pending_execution");
        LocalTime time = LocalTime.parse(info.getEntryHour());

        appointment.setEntryHour(time);

        time = time.plusMinutes(Long.parseLong(info.getEstimatedTimeMinutes()));

        appointment.setEstimatedEndHour(time);

        appointmentRepository.save(appointment);

        for (List<String> user_specialty : info.getUser_specialty()) {

            User tmp_user = userService.findByIdentifier(user_specialty.get(0));

            Specialty tmp_specialty = specialtyService.findByName(user_specialty.get(1));

            attendService.create(appointment, tmp_specialty, tmp_user);
        }

    }

    @Override
    public void finish(Appointment appointment) {
        appointment.setState("finished");
        appointment.setEndHour(LocalTime.now());
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
    public List<Appointment> findAllByUserAndState(User user, String state) {
        return appointmentRepository.findAllByUserAndState(user, state);
    }

    @Override
    public List<Appointment> findAllByUser(User user) {
        return appointmentRepository.findAllByUser(user);
    }

}
