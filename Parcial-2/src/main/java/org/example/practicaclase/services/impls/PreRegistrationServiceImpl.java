package org.example.practicaclase.services.impls;

import jakarta.transaction.Transactional;
import org.example.practicaclase.domain.entities.Appointment;
import org.example.practicaclase.domain.entities.PreRegistration;
import org.example.practicaclase.repositories.AppointmentRepository;
import org.example.practicaclase.repositories.PreRegistrationRepository;
import org.example.practicaclase.services.PreRegistrationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PreRegistrationServiceImpl implements PreRegistrationService {

    private final PreRegistrationRepository preRegistrationRepository;
    private final AppointmentRepository appointmentRepository;

    public PreRegistrationServiceImpl(PreRegistrationRepository preRegistrationRepository, AppointmentRepository appointmentRepository) {
        this.preRegistrationRepository = preRegistrationRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public PreRegistration create(PreRegistration preRegistration) {
        return preRegistrationRepository.save(preRegistration);
    }

    @Override
    public PreRegistration findById(UUID id) {
        return preRegistrationRepository.findById(id).orElse(null);
    }

    @Override
    public List<PreRegistration> findAll() {
        return preRegistrationRepository.findAll();
    }

    @Override
    public void delete(UUID id) {
        preRegistrationRepository.deleteById(id);
    }

    @Override
    public List<PreRegistration> findByAppointment(Appointment appointment) {
        return preRegistrationRepository.findByAppointment(appointment);
    }

    @Override
    @Transactional
    public void linkToAppointment(UUID preRegistrationId, UUID appointmentId) {
        PreRegistration preRegistration = findById(preRegistrationId);
        Appointment appointment = appointmentRepository.findById(appointmentId).orElse(null);
        preRegistration.setAppointment(appointment);
        preRegistrationRepository.save(preRegistration);
    }
}
