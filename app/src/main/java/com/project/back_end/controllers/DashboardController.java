package com.project.back_end.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
// Asegúrate de importar tu servicio de autenticación aquí.
// Ejemplo: import com.project.back_end.services.AuthenticationService;
// Si aún no tienes el servicio, comenta las líneas relacionadas para que compile por ahora.

import java.util.Map;

@Controller
public class DashboardController {

    // Inyectamos el servicio (Descomenta y ajusta el nombre de la clase según tu proyecto)
    // @Autowired
    // private AuthenticationService authService;

    // --- Tablero de Administrador ---
    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable String token) {
        // Lógica de validación (Descomenta cuando tengas el servicio)
        /*
        Map<String, String> errors = authService.validateToken(token, "admin");
        if (errors.isEmpty()) {
            // Si no hay errores, el token es válido
            return "admin/adminDashboard"; // Busca en templates/admin/adminDashboard.html
        }
        */

        // Si el token es inválido o hubo errores, redirige al login
        // return "redirect:/";

        // POR AHORA (Para que pruebes la vista sin servicio):
        return "admin/adminDashboard";
    }

    // --- Tablero de Doctor ---
    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable String token) {
        // Lógica de validación (Descomenta cuando tengas el servicio)
        /*
        Map<String, String> errors = authService.validateToken(token, "doctor");
        if (errors.isEmpty()) {
            return "doctor/doctorDashboard"; // Busca en templates/doctor/doctorDashboard.html
        }
        */

        // return "redirect:/";

        // POR AHORA:
        return "doctor/doctorDashboard";
    }
}