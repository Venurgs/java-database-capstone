package com.project.back_end.repo;

import com.project.back_end.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    // Encuentra por email
    Patient findByEmail(String email);

    // Encuentra por email o teléfono
    Patient findByEmailOrPhone(String email, String phone);
}