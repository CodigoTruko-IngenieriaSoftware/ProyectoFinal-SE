package org.example.parcial2ncapas.services.impls;

import jakarta.transaction.Transactional;
import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.User;
import org.example.parcial2ncapas.repositories.AppointmentRepository;
import org.example.parcial2ncapas.repositories.UserRepository;
import org.example.parcial2ncapas.services.AppointmentService;
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
        appointment.getDoctors().addAll(users);
        appointmentRepository.save(appointment);
    }

    @Override
    @Transactional
    public void removeUserFromAppointment(UUID appointmentId, UUID userId) {
        Appointment appointment = findById(appointmentId);
        appointment.getDoctors().removeIf(user -> user.getId().equals(userId));
        appointmentRepository.save(appointment);
    }
}
