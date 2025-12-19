package com.project.back_end.controllers;

import com.project.back_end.models.Login;
import com.project.back_end.models.Patient;
import com.project.back_end.services.PatientService;
import com.project.back_end.services.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/patient")
public class PatientController {

    @Autowired private PatientService patientService;
    @Autowired private Service service;

    @GetMapping("/{token}")
    public ResponseEntity<?> getDetails(@PathVariable String token) {
        ResponseEntity<Map<String, String>> val = service.validateToken(token, "patient");
        if (val != null) return val;
        return patientService.getPatientDetails(token);
    }

    @PostMapping
    public ResponseEntity<?> createPatient(@RequestBody Patient patient) {
        if (!service.validatePatient(patient)) {
            return new ResponseEntity<>(Map.of("message", "El paciente ya existe"), HttpStatus.CONFLICT);
        }
        if (patientService.createPatient(patient) == 1) {
            return new ResponseEntity<>(Map.of("message", "Registro exitoso"), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(Map.of("message", "Error interno"), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login login) {
        return service.validatePatientLogin(login);
    }

    @GetMapping("/{id}/{token}")
    public ResponseEntity<?> getAppointments(@PathVariable Long id, @PathVariable String token) {
        ResponseEntity<Map<String, String>> val = service.validateToken(token, "patient");
        if (val != null) return val;
        return patientService.getPatientAppointment(id, token);
    }
}
