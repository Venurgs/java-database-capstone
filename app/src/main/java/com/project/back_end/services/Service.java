package com.project.back_end.services;


import com.project.back_end.models.*;
import com.project.back_end.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@org.springframework.stereotype.Service
public class Service {

    @Autowired private TokenService tokenService;
    @Autowired private AdminRepository adminRepository;
    @Autowired private DoctorRepository doctorRepository;
    @Autowired private PatientRepository patientRepository;
    @Autowired private DoctorService doctorService;
    @Autowired private PatientService patientService;

    public ResponseEntity<Map<String, String>> validateToken(String token, String userRole) {
        Map<String, String> response = new HashMap<>();
        try {
            String identifier = tokenService.extractIdentifier(token);
            boolean isValid = false;

            if ("admin".equals(userRole)) {
                isValid = adminRepository.findByUsername(identifier) != null;
            } else if ("doctor".equals(userRole)) {
                isValid = doctorRepository.findByEmail(identifier) != null;
            } else if ("patient".equals(userRole)) {
                isValid = patientRepository.findByEmail(identifier) != null;
            }

            if (isValid && tokenService.validateToken(token, identifier)) {
                return null; // Null indica que no hay error (patrón del laboratorio)
            }
        } catch (Exception e) {
            // Token expirado o malformado
        }

        response.put("message", "Unauthorized or Expired");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    public ResponseEntity<Map<String, String>> validateAdmin(Admin receivedAdmin) {
        Map<String, String> response = new HashMap<>();
        Admin admin = adminRepository.findByUsername(receivedAdmin.getUsername());
        if (admin != null && admin.getPassword().equals(receivedAdmin.getPassword())) {
            String token = tokenService.generateToken(admin.getUsername());
            response.put("token", token);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        response.put("message", "Invalid credentials");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    public Map<String, Object> filterDoctor(String name, String specialty, String time) {
        // Lógica de orquestación para filtrar usando DoctorService
        if (name != null && specialty != null && time != null)
            return doctorService.filterDoctorsByNameSpecilityandTime(name, specialty, time);
        // ... (resto de combinaciones, simplificado para el ejemplo)
        return doctorService.filterDoctorsByTime(time != null ? time : "AM");
    }

    public int validateAppointment(Appointment appointment) {
        // Verificar si doctor existe y si el horario es válido
        if (!doctorRepository.existsById(appointment.getDoctor().getId())) return -1;
        // Simplificado: retorna 1
        return 1;
    }

    public boolean validatePatient(Patient patient) {
        return patientRepository.findByEmailOrPhone(patient.getEmail(), patient.getPhone()) == null;
    }

    public ResponseEntity<Map<String, String>> validatePatientLogin(Login login) {
        Map<String, String> response = new HashMap<>();
        Patient patient = patientRepository.findByEmail(login.getIdentifier());
        if (patient != null && patient.getPassword().equals(login.getPassword())) {
            String token = tokenService.generateToken(patient.getEmail());
            response.put("token", token);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        response.put("message", "Invalid credentials");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    public ResponseEntity<Map<String, Object>> filterPatient(String condition, String name, String token) {
        // Obtener ID del paciente del token
        String email = tokenService.extractIdentifier(token);
        Patient p = patientRepository.findByEmail(email);

        if (condition != null && name != null) {
            return patientService.filterByDoctorAndCondition(condition, name, p.getId());
        } else if (name != null) {
            return patientService.filterByDoctor(name, p.getId());
        }
        return patientService.filterByCondition(condition, p.getId());
    }
}