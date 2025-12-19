package com.project.back_end.controllers;

import com.project.back_end.models.Prescription;
import com.project.back_end.services.PrescriptionService;
import com.project.back_end.services.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "prescription")
public class PrescriptionController {

    @Autowired private PrescriptionService prescriptionService;
    @Autowired private Service service;

    @PostMapping("/{token}")
    public ResponseEntity<?> savePrescription(@PathVariable String token, @RequestBody Prescription prescription) {
        ResponseEntity<Map<String, String>> val = service.validateToken(token, "doctor");
        if (val != null) return val;
        return prescriptionService.savePrescription(prescription);
    }

    @GetMapping("/{appointmentId}/{token}")
    public ResponseEntity<?> getPrescription(@PathVariable Long appointmentId, @PathVariable String token) {
        ResponseEntity<Map<String, String>> val = service.validateToken(token, "doctor"); // O paciente
        if (val != null) return val;
        return prescriptionService.getPrescription(appointmentId);
    }
}