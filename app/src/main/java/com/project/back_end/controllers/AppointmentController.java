package com.project.back_end.controllers;

import com.project.back_end.models.Appointment;
import com.project.back_end.services.AppointmentService;
import com.project.back_end.services.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    private Service service;

    @GetMapping("/{date}/{patientName}/{token}")
    public ResponseEntity<?> getAppointments(@PathVariable String date, @PathVariable String patientName, @PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "doctor");
        if (validation != null) return validation;

        LocalDate localDate = LocalDate.parse(date);
        return new ResponseEntity<>(appointmentService.getAppointment(patientName.equals("null") ? null : patientName, localDate, token), HttpStatus.OK);
    }

    @PostMapping("/{token}")
    public ResponseEntity<?> bookAppointment(@PathVariable String token, @RequestBody Appointment appointment) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "patient");
        if (validation != null) return validation;

        if (service.validateAppointment(appointment) == 1) {
            if (appointmentService.bookAppointment(appointment) == 1) {
                return new ResponseEntity<>(Map.of("message", "Cita reservada"), HttpStatus.CREATED);
            }
        }
        return new ResponseEntity<>(Map.of("message", "Error al reservar"), HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/{token}")
    public ResponseEntity<?> updateAppointment(@PathVariable String token, @RequestBody Appointment appointment) {
        // En un caso real validamos que quien actualiza tenga permisos
        return appointmentService.updateAppointment(appointment);
    }

    @DeleteMapping("/{id}/{token}")
    public ResponseEntity<?> cancelAppointment(@PathVariable long id, @PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "patient");
        if (validation != null) return validation;
        return appointmentService.cancelAppointment(id);
    }
}