package org.example.parcial2ncapas.services.impls;

import jakarta.transaction.Transactional;
import org.example.parcial2ncapas.domain.dtos.prescription.PrescriptionCreateRequestDTO;
import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.Prescription;
import org.example.parcial2ncapas.repositories.AppointmentRepository;
import org.example.parcial2ncapas.repositories.AttendRepository;
import org.example.parcial2ncapas.repositories.PrescriptionRepository;
import org.example.parcial2ncapas.services.PrescriptionService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;
    private final AttendRepository attendRepository;

    public PrescriptionServiceImpl(PrescriptionRepository prescriptionRepository, AppointmentRepository appointmentRepository, AttendRepository attendRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.appointmentRepository = appointmentRepository;
        this.attendRepository = attendRepository;
    }

    @Override
    public void create(Appointment appointment, PrescriptionCreateRequestDTO info) {
        for (List<String> prescription : info.getPrescriptions()) {
            Prescription temp_prescription = new Prescription();
            temp_prescription.setAppointment(appointment);
            temp_prescription.setDose(prescription.get(0));
            temp_prescription.setInstructions(prescription.get(1));
            temp_prescription.setIssueDate(LocalDate.parse(prescription.get(2)));
            prescriptionRepository.save(temp_prescription);

        }
    }

    @Override
    public Prescription findById(UUID id) {
        return prescriptionRepository.findById(id).orElse(null);
    }

    @Override
    public List<Prescription> findAll() {
        return prescriptionRepository.findAll();
    }

    @Override
    public List<Prescription> findAllByAppointments(List<Appointment> appointments) {
        return prescriptionRepository.findAllByAppointmentAndIssueDateAfterToday(appointments);
    }


    @Override
    public void delete(UUID id) {
        prescriptionRepository.deleteById(id);
    }

    @Override
    public List<Prescription> findByAppointment(Appointment appointment) {
        return prescriptionRepository.findByAppointment(appointment);
    }

    @Override
    @Transactional
    public void linkToAppointment(UUID preRegistrationId, UUID appointmentId) {
        Prescription prescription = findById(preRegistrationId);
        Appointment appointment = appointmentRepository.findById(appointmentId).orElse(null);
        prescription.setAppointment(appointment);
        prescriptionRepository.save(prescription);
    }
}
