package com.project.back_end.services;


import com.project.back_end.models.Appointment;
import com.project.back_end.models.AppointmentDTO;
import com.project.back_end.models.Patient;
import com.project.back_end.repositories.AppointmentRepository;
import com.project.back_end.repositories.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private TokenService tokenService;

    public int createPatient(Patient patient) {
        try {
            patientRepository.save(patient);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    public ResponseEntity<Map<String, Object>> getPatientAppointment(Long id, String token) {
        String email = tokenService.extractIdentifier(token);
        Patient patient = patientRepository.findById(id).orElse(null);

        if (patient == null || !patient.getEmail().equals(email)) {
            return new ResponseEntity<>(Map.of("message", "Unauthorized"), HttpStatus.UNAUTHORIZED);
        }

        List<Appointment> appointments = appointmentRepository.findByPatientId(id);
        List<AppointmentDTO> dtos = appointments.stream().map(this::convertToDTO).collect(Collectors.toList());

        return new ResponseEntity<>(Map.of("appointments", dtos), HttpStatus.OK);
    }

    // Helpers de filtrado (lógica simplificada en memoria o repos)
    public ResponseEntity<Map<String, Object>> filterByCondition(String condition, Long id) {
        int status = "past".equalsIgnoreCase(condition) ? 1 : 0;
        List<Appointment> list = appointmentRepository.findByPatient_IdAndStatusOrderByAppointmentTimeAsc(id, status);
        return new ResponseEntity<>(Map.of("appointments", list), HttpStatus.OK);
    }

    public ResponseEntity<Map<String, Object>> filterByDoctor(String name, Long patientId) {
        List<Appointment> list = appointmentRepository.filterByDoctorNameAndPatientId(name, patientId);
        return new ResponseEntity<>(Map.of("appointments", list), HttpStatus.OK);
    }

    public ResponseEntity<Map<String, Object>> filterByDoctorAndCondition(String condition, String name, long patientId) {
        int status = "past".equalsIgnoreCase(condition) ? 1 : 0;
        List<Appointment> list = appointmentRepository.filterByDoctorNameAndPatientIdAndStatus(name, patientId, status);
        return new ResponseEntity<>(Map.of("appointments", list), HttpStatus.OK);
    }

    public ResponseEntity<Map<String, Object>> getPatientDetails(String token) {
        String email = tokenService.extractIdentifier(token);
        Patient patient = patientRepository.findByEmail(email);
        if (patient != null) {
            return new ResponseEntity<>(Map.of("patient", patient), HttpStatus.OK);
        }
        return new ResponseEntity<>(Map.of("message", "User not found"), HttpStatus.NOT_FOUND);
    }

    private AppointmentDTO convertToDTO(Appointment a) {
        // Conversión manual o usando un constructor DTO
        return new AppointmentDTO(a.getId(), a.getDoctor().getId(), a.getDoctor().getName(),
                a.getPatient().getId(), a.getPatient().getName(), a.getPatient().getEmail(),
                a.getPatient().getPhone(), a.getPatient().getAddress(),
                a.getAppointmentTime(), a.getStatus());
    }
}