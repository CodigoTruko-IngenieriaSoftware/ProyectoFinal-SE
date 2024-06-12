package org.example.parcial2ncapas.controllers;

import jakarta.validation.Valid;
import org.example.parcial2ncapas.domain.dtos.GeneralResponse;
import org.example.parcial2ncapas.domain.dtos.prescription.PrescriptionCreateRequestDTO;
import org.example.parcial2ncapas.domain.dtos.prescription.PrescriptionSearchRequestDTO;
import org.example.parcial2ncapas.domain.dtos.prescription.schedule.*;
import org.example.parcial2ncapas.domain.entities.Appointment;
import org.example.parcial2ncapas.domain.entities.Attend;
import org.example.parcial2ncapas.domain.entities.Record;
import org.example.parcial2ncapas.domain.entities.User;
import org.example.parcial2ncapas.services.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clinic")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final AppointmentService appointmentService;
    private final UserService userService;
    private final AttendService attendService;
    private final RecordService recordService;

    public PrescriptionController(PrescriptionService prescriptionService, AppointmentService appointmentService, UserService userService, AttendService attendService, RecordService recordService) {
        this.prescriptionService = prescriptionService;
        this.appointmentService = appointmentService;
        this.userService = userService;
        this.attendService = attendService;
        this.recordService = recordService;
    }

    @PostMapping("/prescription")
    public ResponseEntity<GeneralResponse> createPrescription(@AuthenticationPrincipal User user, @RequestBody @Valid PrescriptionCreateRequestDTO info){

        Appointment appointment = appointmentService.findById(UUID.fromString(info.getAppointmentId()));

        if(appointment == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Appointment not found");
        }

        if(userService.isUserAssignedToThisAppointment(user, appointment)){ //Verifica si el doctor esta asignado a esta cita, ya que solo el puede recetar

            for (List<String> prescription : info.getPrescriptions()) {
                if (prescription.size() != 3) {
                    return GeneralResponse.getResponse(HttpStatus.BAD_REQUEST, "Prescription does not have two attributes");

                }
            }

            prescriptionService.create(appointment, info);
            return GeneralResponse.getResponse(HttpStatus.OK, "Prescription created");
        }
        else{
            return GeneralResponse.getResponse(HttpStatus.FORBIDDEN, "User not assigned to this appointment");
        }

    }

    @GetMapping("/prescription")
    public ResponseEntity<GeneralResponse> getAll(){
        return GeneralResponse.getResponse(HttpStatus.OK, prescriptionService.findAll());
    }

    @GetMapping("/prescription/{user_id}")
    public ResponseEntity<GeneralResponse> getAllById(@PathVariable String user_id){
        User user = userService.findById(UUID.fromString(user_id));
        if(user == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "User not found");
        }

        List<Appointment> appointments = appointmentService.findAllByUser(user);
        return GeneralResponse.getResponse(HttpStatus.OK, prescriptionService.findAllByAppointments(appointments));
    }

    @PostMapping("/schedule")
    public ResponseEntity<GeneralResponse> schedule(@AuthenticationPrincipal User user, @RequestBody @Valid ScheduleRequestDTO info){
        List<Attend> attends = attendService.findByUser(user);

        List<Appointment> appointments = appointmentService.findAllByDateAndAttends(LocalDate.parse(info.getDate()), attends);

        ScheduleResponseDTO scheduleResponseDTO = new ScheduleResponseDTO();

        List<ScheduleAppointmentDTO> scheduleAppointmentDTOList = new ArrayList<>();
        for(Appointment appointment : appointments){

            SchedulePatientDTO schedulePatientDTO = new SchedulePatientDTO();

            //Assign Records
            List<Record> records_list = recordService.findByUser(appointment.getUser());

            List<ScheduleRecordDTO> scheduleRecordDTOList = new ArrayList<>();
            for(Record record_tmp : records_list){
                ScheduleRecordDTO record = new ScheduleRecordDTO();
                record.setRecordId(record_tmp.getId());
                record.setReason(record_tmp.getReason());
                record.setDate(record_tmp.getCreationDate());
                scheduleRecordDTOList.add(record);
            }

            schedulePatientDTO.setPatientId(appointment.getUser().getId());
            schedulePatientDTO.setRecord(scheduleRecordDTOList);


            List<User> doctors_list = attendService.findAllUsersByAppointment(appointment);
            List<ScheduleDoctorDTO> scheduleDoctorDTOList = new ArrayList<>();
            for(User user_tmp : doctors_list){
                if(!user_tmp.getId().equals(user.getId())){
                    ScheduleDoctorDTO scheduleDoctorDTO = new ScheduleDoctorDTO();
                    scheduleDoctorDTO.setUserId(user_tmp.getId());
                    scheduleDoctorDTO.setUsername(user_tmp.getUsername());
                    scheduleDoctorDTOList.add(scheduleDoctorDTO);
                }
            }

            //FinalDTO
            ScheduleAppointmentDTO scheduleAppointmentDTO = new ScheduleAppointmentDTO();
            scheduleAppointmentDTO.setAppointmentId(appointment.getId());
            scheduleAppointmentDTO.setPatient(schedulePatientDTO);
            scheduleAppointmentDTO.setDoctors(scheduleDoctorDTOList);


            scheduleAppointmentDTOList.add(scheduleAppointmentDTO);
        }

        scheduleResponseDTO.setAppointments(scheduleAppointmentDTOList);
        return GeneralResponse.getResponse(HttpStatus.OK, scheduleResponseDTO);
    }

    @PostMapping("/prescription/search")
    public ResponseEntity<GeneralResponse> getAllByAppointment(@RequestBody @Valid PrescriptionSearchRequestDTO info){
        Appointment appointment = appointmentService.findById(UUID.fromString(info.getAppointmentId()));
        if(appointment == null){
            return GeneralResponse.getResponse(HttpStatus.NOT_FOUND, "Appointment not found");
        }

        return GeneralResponse.getResponse(HttpStatus.OK, prescriptionService.findByAppointment(appointment));
    }
}