package org.example.apitaller4.services.impls;

import org.example.apitaller4.domain.dtos.appointment.AppointmentRequestRequestDTO;
import org.example.apitaller4.domain.dtos.appointment.AppointmentApproveRequestDTO;
import org.example.apitaller4.domain.dtos.appointment.AppointmentStartRequestDTO;
import org.example.apitaller4.domain.entities.*;
import org.example.apitaller4.repositories.AppointmentRepository;
import org.example.apitaller4.services.AppointmentService;
import org.example.apitaller4.services.AttendService;
import org.example.apitaller4.services.SpecialtyService;
import org.example.apitaller4.services.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

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
    public void start(Appointment appointment) {
        appointment.setState("in_execution");

    }

    @Override
    public void finish(Appointment appointment) {
        appointment.setState("finished");
        appointment.setEndHour(LocalTime.now());
        appointmentRepository.save(appointment);
    }

    @Override
    public void reject(Appointment appointment) {
        appointment.setState("rejected");
        appointmentRepository.save(appointment);

    }

    @Override
    public void cancel(Appointment appointment) {
        appointment.setState("cancelled");
        appointmentRepository.save(appointment);
    }

    @Override
    public Boolean isUserHasThisAppointment(User user, Appointment appointment) {
        List<Appointment> tmp =  appointmentRepository.findAllAppointmentsByIdAndUser(appointment.getId(), user);
        System.out.println(tmp.isEmpty());
        return !tmp.isEmpty();
    }

    @Override
    public Boolean isValidDateAndHour(User medic, LocalDate date, AppointmentApproveRequestDTO info) {

        LocalTime entryHour = LocalTime.parse(info.getEntryHour());
        entryHour = entryHour.plusMinutes(-15);

        LocalTime finalHour = LocalTime.parse(info.getEntryHour());
        finalHour = finalHour.plusMinutes(Long.parseLong(info.getEstimatedTimeMinutes()));
        finalHour = finalHour.plusMinutes(15);


        List<Appointment> appointmentsInRange = appointmentRepository.findAllAppointmentsByDateAndEstimatedEndHourAfterAndEntryHourBefore(date, entryHour, finalHour);

        for (Appointment appointment : appointmentsInRange) {
            if(userService.isUserAssignedToThisAppointment(medic, appointment)){
                return false;
            }
        }


        return true;

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

    @Override
    public List<Appointment> findAllByDateAndAttends(LocalDate date, List<Attend> attends) {
        List<UUID> attendIds = attends.stream()
                .map(Attend::getId)
                .collect(Collectors.toList());

        return appointmentRepository.findAllByDateAndAttendIds(date, attendIds);

    }

}
