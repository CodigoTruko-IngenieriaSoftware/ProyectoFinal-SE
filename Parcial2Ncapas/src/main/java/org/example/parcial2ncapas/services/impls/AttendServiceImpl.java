package org.example.parcial2ncapas.services.impls;

import org.example.parcial2ncapas.domain.dtos.attend.AttendCreateRequestDTO;
import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.Attend;
import org.example.parcial2ncapas.domain.entities.Specialty;
import org.example.parcial2ncapas.domain.entities.User;
import org.example.parcial2ncapas.repositories.AttendRepository;
import org.example.parcial2ncapas.services.AttendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendServiceImpl implements AttendService {

    private final AttendRepository attendRepository;

    public AttendServiceImpl(AttendRepository attendRepository) {
        this.attendRepository = attendRepository;
    }

    @Override
    public void create(Appointment appointment, Specialty specialty, User user) {
        Attend attend = new Attend();
        attend.setAppointment(appointment);
        attend.setSpecialty(specialty);
        attend.setUser(user);
        attendRepository.save(attend);
    }

    @Override
    public List<Attend> findAll() {
        return attendRepository.findAll();
    }

    @Override
    public List<Attend> findByUser(User user) {
        return attendRepository.findAttendsByUser(user);
    }
}
