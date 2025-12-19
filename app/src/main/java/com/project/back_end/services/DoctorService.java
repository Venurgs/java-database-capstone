package com.project.back_end.services;


import com.project.back_end.models.Doctor;
import com.project.back_end.models.Login;
import com.project.back_end.repositories.AppointmentRepository;
import com.project.back_end.repositories.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private TokenService tokenService;

    public List<String> getDoctorAvailability(Long doctorId, LocalDate date) {
        Optional<Doctor> doctor = doctorRepository.findById(doctorId);
        if (doctor.isPresent()) {
            // Lógica simplificada: Devolver los horarios base del doctor
            return doctor.get().getAvailableTimes();
            // Nota: En un sistema real, aquí restaríamos las citas ya reservadas en 'appointmentRepository'
        }
        return new ArrayList<>();
    }

    public int saveDoctor(Doctor doctor) {
        if (doctorRepository.findByEmail(doctor.getEmail()) != null) {
            return -1; // Ya existe
        }
        try {
            doctorRepository.save(doctor);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    public int updateDoctor(Doctor doctor) {
        if (doctorRepository.existsById(doctor.getId())) {
            doctorRepository.save(doctor);
            return 1;
        }
        return -1;
    }

    public List<Doctor> getDoctors() {
        return doctorRepository.findAll();
    }

    public int deleteDoctor(long id) {
        if (doctorRepository.existsById(id)) {
            appointmentRepository.deleteAllByDoctorId(id);
            doctorRepository.deleteById(id);
            return 1;
        }
        return -1;
    }

    public ResponseEntity<Map<String, String>> validateDoctor(Login login) {
        Map<String, String> response = new HashMap<>();
        Doctor doctor = doctorRepository.findByEmail(login.getIdentifier());
        if (doctor != null && doctor.getPassword().equals(login.getPassword())) {
            String token = tokenService.generateToken(doctor.getEmail());
            response.put("token", token);
            response.put("message", "Login successful");
            response.put("id", doctor.getId().toString()); // Útil para el frontend
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        response.put("message", "Invalid credentials");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    // --- Métodos de Filtrado ---

    public Map<String, Object> findDoctorByName(String name) {
        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctorRepository.findByNameLike(name));
        return response;
    }

    public Map<String, Object> filterDoctorsByNameSpecilityandTime(String name, String specialty, String amOrPm) {
        List<Doctor> doctors = doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty);
        return Map.of("doctors", filterDoctorByTime(doctors, amOrPm));
    }

    public Map<String, Object> filterDoctorByNameAndTime(String name, String amOrPm) {
        List<Doctor> doctors = doctorRepository.findByNameLike(name);
        return Map.of("doctors", filterDoctorByTime(doctors, amOrPm));
    }

    public Map<String, Object> filterDoctorByNameAndSpecility(String name, String specialty) {
        return Map.of("doctors", doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty));
    }

    public Map<String, Object> filterDoctorByTimeAndSpecility(String specialty, String amOrPm) {
        List<Doctor> doctors = doctorRepository.findBySpecialtyIgnoreCase(specialty);
        return Map.of("doctors", filterDoctorByTime(doctors, amOrPm));
    }

    public Map<String, Object> filterDoctorBySpecility(String specialty) {
        return Map.of("doctors", doctorRepository.findBySpecialtyIgnoreCase(specialty));
    }

    public Map<String, Object> filterDoctorsByTime(String amOrPm) {
        return Map.of("doctors", filterDoctorByTime(doctorRepository.findAll(), amOrPm));
    }

    private List<Doctor> filterDoctorByTime(List<Doctor> doctors, String amOrPm) {
        List<Doctor> filtered = new ArrayList<>();
        for (Doctor d : doctors) {
            for (String time : d.getAvailableTimes()) {
                // Lógica simple: si el horario contiene "09", "10", "11" es AM, si "13", "14" etc es PM
                int hour = Integer.parseInt(time.split(":")[0]);
                if ("AM".equalsIgnoreCase(amOrPm) && hour < 12) {
                    filtered.add(d);
                    break;
                } else if ("PM".equalsIgnoreCase(amOrPm) && hour >= 12) {
                    filtered.add(d);
                    break;
                }
            }
        }
        return filtered;
    }
}