package org.example.practicaclase.services.impls;

import jakarta.transaction.Transactional;
import org.example.practicaclase.domain.entities.Appointment;
import org.example.practicaclase.domain.entities.User;
import org.example.practicaclase.repositories.AppointmentRepository;
import org.example.practicaclase.repositories.UserRepository;
import org.example.practicaclase.services.AppointmentService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Appointment create(Appointment info) {
        return appointmentRepository.save(info);
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
        return appointmentRepository.findByUsers(user);
    }

    @Override
    @Transactional
    public void addUsersToAppointment(UUID appointmentId, List<UUID> userIds) {
        Appointment appointment = findById(appointmentId);
        List<User> users = userRepository.findAllById(userIds);
        appointment.getUsers().addAll(users);
        appointmentRepository.save(appointment);
    }

    @Override
    @Transactional
    public void removeUserFromAppointment(UUID appointmentId, UUID userId) {
        Appointment appointment = findById(appointmentId);
        appointment.getUsers().removeIf(user -> user.getId().equals(userId));
        appointmentRepository.save(appointment);
    }
}
