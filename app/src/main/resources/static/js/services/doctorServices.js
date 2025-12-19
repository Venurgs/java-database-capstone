/*
  Import the base API URL from the config file
  Define a constant DOCTOR_API to hold the full endpoint for doctor-related actions


  Function: getDoctors
  Purpose: Fetch the list of all doctors from the API

   Use fetch() to send a GET request to the DOCTOR_API endpoint
   Convert the response to JSON
   Return the 'doctors' array from the response
   If there's an error (e.g., network issue), log it and return an empty array


  Function: deleteDoctor
  Purpose: Delete a specific doctor using their ID and an authentication token

   Use fetch() with the DELETE method
    - The URL includes the doctor ID and token as path parameters
   Convert the response to JSON
   Return an object with:
    - success: true if deletion was successful
    - message: message from the server
   If an error occurs, log it and return a default failure response


  Function: saveDoctor
  Purpose: Save (create) a new doctor using a POST request

   Use fetch() with the POST method
    - URL includes the token in the path
    - Set headers to specify JSON content type
    - Convert the doctor object to JSON in the request body

   Parse the JSON response and return:
    - success: whether the request succeeded
    - message: from the server

   Catch and log errors
    - Return a failure response if an error occurs


  Function: filterDoctors
  Purpose: Fetch doctors based on filtering criteria (name, time, and specialty)

   Use fetch() with the GET method
    - Include the name, time, and specialty as URL path parameters
   Check if the response is OK
    - If yes, parse and return the doctor data
    - If no, log the error and return an object with an empty 'doctors' array

   Catch any other errors, alert the user, and return a default empty result
*/
/**
 * doctorServices.js
 * Servicios para interactuar con la API de Doctores.
 */

import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = API_BASE_URL + '/doctor';

// 1. Obtener todos los médicos
export async function getDoctors() {
    try {
        const response = await fetch(DOCTOR_API);
        if (!response.ok) throw new Error("Error fetching doctors");
        const doctors = await response.json();
        return doctors; // Devuelve array de doctores
    } catch (error) {
        console.error("Error en getDoctors:", error);
        return []; // Retorna vacío para no romper la UI
    }
}

// 2. Eliminar un médico
export async function deleteDoctor(id, token) {
    try {
        const url = `${DOCTOR_API}?id=${id}&token=${token}`; // Ajusta según tu backend (query param o header)
        const response = await fetch(url, {
            method: 'DELETE',
            // headers: { 'Authorization': `Bearer ${token}` } // Forma estándar
        });

        if (response.ok) {
            return { success: true, message: "Doctor eliminado" };
        } else {
            return { success: false, message: "Error al eliminar" };
        }
    } catch (error) {
        console.error("Error en deleteDoctor:", error);
        return { success: false, message: "Error de red" };
    }
}

// 3. Guardar (Crear) un nuevo médico
export async function saveDoctor(doctorData, token) {
    try {
        const response = await fetch(`${DOCTOR_API}?token=${token}`, { // Ajusta el paso de token
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doctorData)
        });

        if (response.ok) {
            return { success: true, message: "Doctor creado exitosamente" };
        } else {
            const errorText = await response.text();
            return { success: false, message: errorText || "Error al crear doctor" };
        }
    } catch (error) {
        console.error("Error en saveDoctor:", error);
        return { success: false, message: "Error inesperado" };
    }
}

// 4. Filtrar médicos (Búsqueda)
export async function filterDoctors(name, time, specialty) {
    try {
        // Construcción de URL con query params
        const params = new URLSearchParams();
        if (name) params.append("docName", name);
        if (time) params.append("availableTime", time);
        if (specialty) params.append("specialty", specialty);

        const url = `${DOCTOR_API}/filter?${params.toString()}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Error filtering doctors");

        return await response.json();
    } catch (error) {
        console.error("Error en filterDoctors:", error);
        alert("Error al filtrar resultados.");
        return [];
    }
}