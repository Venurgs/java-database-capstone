/**
 * doctorDashboard.js
 * Lógica para el panel del doctor: gestión de citas.
 */

// Asegúrate de que este servicio exista o ajusta la ruta a patientServices.js si ahí pusiste la lógica
import { getAllAppointments } from './services/appointmentRecordService.js';
import { createPatientRow } from './components/patientRows.js';

// Variables Globales
const patientTableBody = document.getElementById("patientTableBody");
let selectedDate = new Date().toISOString().split('T')[0]; // Hoy en formato YYYY-MM-DD
let patientName = null;
const token = localStorage.getItem("token");

document.addEventListener('DOMContentLoaded', () => {
    // Renderizado inicial
    loadAppointments();

    // 1. Configurar Barra de Búsqueda
    const searchBar = document.getElementById("searchBar");
    if (searchBar) {
        searchBar.addEventListener("input", (e) => {
            const value = e.target.value.trim();
            patientName = value === "" ? null : value;
            loadAppointments();
        });
    }

    // 2. Configurar Filtros de Fecha
    const btnToday = document.getElementById("btnToday");
    const dateFilter = document.getElementById("dateFilter");

    if (btnToday) {
        btnToday.addEventListener("click", () => {
            selectedDate = new Date().toISOString().split('T')[0];
            if (dateFilter) dateFilter.value = selectedDate;
            loadAppointments();
        });
    }

    if (dateFilter) {
        // Inicializar input date con hoy
        dateFilter.value = selectedDate;
        dateFilter.addEventListener("change", (e) => {
            selectedDate = e.target.value;
            loadAppointments();
        });
    }
});

// 3. Función loadAppointments
async function loadAppointments() {
    if (!patientTableBody) return;

    patientTableBody.innerHTML = "<tr><td colspan='5'>Cargando citas...</td></tr>";

    try {
        // Llama al servicio (asegúrate de que acepte estos parámetros)
        const appointments = await getAllAppointments(selectedDate, patientName, token);

        patientTableBody.innerHTML = ""; // Limpiar

        if (!appointments || appointments.length === 0) {
            patientTableBody.innerHTML = "<tr><td colspan='5' class='noPatientRecord'>No se encontraron citas para esta fecha/búsqueda.</td></tr>";
            return;
        }

        // Crear filas
        appointments.forEach(appointment => {
            // Se asume que appointment trae datos del paciente anidados o planos
            const row = createPatientRow(appointment);
            patientTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading appointments:", error);
        patientTableBody.innerHTML = "<tr><td colspan='5' style='color:red;'>Error al cargar las citas. Intente nuevamente.</td></tr>";
    }
}