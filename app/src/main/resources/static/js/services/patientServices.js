/**
 * patientServices.js
 * Servicios para interactuar con la API de Pacientes.
 */

import { API_BASE_URL } from "../config/config.js";

const PATIENT_API = API_BASE_URL + '/patient';

// 1. Registro de Paciente
export async function patientSignup(data) {
    try {
        const response = await fetch(`${PATIENT_API}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            return { success: true, message: "Registro exitoso" };
        } else {
            const err = await response.text();
            return { success: false, message: err || "Error en el registro" };
        }
    } catch (error) {
        console.error("Error en patientSignup:", error);
        return { success: false, message: "Error de red" };
    }
}

// 2. Login de Paciente
export async function patientLogin(data) {
    try {
        const response = await fetch(`${PATIENT_API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        // Retornamos la respuesta "cruda" para que el controlador (index.js o modal)
        // decida qué hacer (extraer token, redirigir, etc.)
        return response;
    } catch (error) {
        console.error("Error en patientLogin:", error);
        throw error;
    }
}

// 3. Obtener datos del paciente conectado
export async function getPatientData(token) {
    try {
        if (!token) return null;
        // Asumiendo endpoint: /patient/details?token=...
        const response = await fetch(`${PATIENT_API}/details?token=${token}`);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error("Error en getPatientData:", error);
        return null;
    }
}

// 4. Obtener Citas (Funciona para Doctor viendo pacientes o Paciente viendo sus citas)
export async function getPatientAppointments(id, token, userType) {
    try {
        // userType: 'doctor' o 'patient'
        // La URL podría variar según tu backend, ej: /appointment/list?id=...
        const APPOINTMENT_API = API_BASE_URL + '/appointment';
        const url = `${APPOINTMENT_API}/list?id=${id}&token=${token}&user=${userType}`;

        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        }
        console.warn("Fallo al obtener citas");
        return null;
    } catch (error) {
        console.error("Error en getPatientAppointments:", error);
        return null;
    }
}

// 5. Filtrar Citas
export async function filterAppointments(condition, name, token) {
    try {
        const APPOINTMENT_API = API_BASE_URL + '/appointment';
        const params = new URLSearchParams();
        if (condition) params.append("status", condition);
        if (name) params.append("patientName", name);
        params.append("token", token);

        const url = `${APPOINTMENT_API}/filter?${params.toString()}`;
        const response = await fetch(url);

        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error("Error en filterAppointments:", error);
        alert("Error inesperado al filtrar citas.");
        return [];
    }
}