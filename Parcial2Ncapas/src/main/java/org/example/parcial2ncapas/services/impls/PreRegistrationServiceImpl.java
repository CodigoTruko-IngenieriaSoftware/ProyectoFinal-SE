package org.example.parcial2ncapas.services.impls;

import jakarta.transaction.Transactional;
import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.Prescription;
import org.example.parcial2ncapas.repositories.AppointmentRepository;
import org.example.parcial2ncapas.repositories.PreRegistrationRepository;
import org.example.parcial2ncapas.services.PreRegistrationService;
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
    public Prescription create(Prescription prescription) {
        return preRegistrationRepository.save(prescription);
    }

    @Override
    public Prescription findById(UUID id) {
        return preRegistrationRepository.findById(id).orElse(null);
    }

    @Override
    public List<Prescription> findAll() {
        return preRegistrationRepository.findAll();
    }

    @Override
    public void delete(UUID id) {
        preRegistrationRepository.deleteById(id);
    }

    @Override
    public List<Prescription> findByAppointment(Appointment appointment) {
        return preRegistrationRepository.findByAppointment(appointment);
    }

    @Override
    @Transactional
    public void linkToAppointment(UUID preRegistrationId, UUID appointmentId) {
        Prescription prescription = findById(preRegistrationId);
        Appointment appointment = appointmentRepository.findById(appointmentId).orElse(null);
        prescription.setAppointment(appointment);
        preRegistrationRepository.save(prescription);
    }
}
