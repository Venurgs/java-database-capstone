package com.project.back_end.controllers;


import com.project.back_end.models.Doctor;
import com.project.back_end.models.Login;
import com.project.back_end.services.DoctorService;
import com.project.back_end.services.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "doctor")
public class DoctorController {

    @Autowired private DoctorService doctorService;
    @Autowired private Service service;

    @GetMapping("/availability/{user}/{doctorId}/{date}/{token}")
    public ResponseEntity<?> getAvailability(@PathVariable String user, @PathVariable Long doctorId, @PathVariable String date, @PathVariable String token) {
        // Valida token según el rol 'user' pasado en la URL
        ResponseEntity<Map<String, String>> val = service.validateToken(token, user);
        if (val != null) return val;

        List<String> times = doctorService.getDoctorAvailability(doctorId, LocalDate.parse(date));
        return new ResponseEntity<>(Map.of("availableTimes", times), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<?> getDoctors() {
        return new ResponseEntity<>(Map.of("doctors", doctorService.getDoctors()), HttpStatus.OK);
    }

    @PostMapping("/{token}")
    public ResponseEntity<?> addDoctor(@PathVariable String token, @RequestBody Doctor doctor) {
        ResponseEntity<Map<String, String>> val = service.validateToken(token, "admin");
        if (val != null) return val;

        int res = doctorService.saveDoctor(doctor);
        if (res == 1) return new ResponseEntity<>(Map.of("message", "Doctor agregado"), HttpStatus.CREATED);
        else if (res == -1) return new ResponseEntity<>(Map.of("message", "El doctor ya existe"), HttpStatus.CONFLICT);
        return new ResponseEntity<>(Map.of("message", "Error interno"), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login login) {
        return doctorService.validateDoctor(login);
    }

    // Métodos Put, Delete, Filter... siguen la misma lógica
    // Implementar updateDoctor, deleteDoctor, filter... llamando a doctorService
}