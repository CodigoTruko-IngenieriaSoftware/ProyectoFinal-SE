package org.example.apitaller4.services.impls;

import org.example.apitaller4.domain.entities.Appointment;
import org.example.apitaller4.domain.entities.Attend;
import org.example.apitaller4.domain.entities.Specialty;
import org.example.apitaller4.domain.entities.User;
import org.example.apitaller4.repositories.AttendRepository;
import org.example.apitaller4.services.AttendService;
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

    @Override
    public List<User> findAllUsersByAppointment(Appointment appointment) {
        return attendRepository.findAllUsersByAppointment(appointment);
    }
}
