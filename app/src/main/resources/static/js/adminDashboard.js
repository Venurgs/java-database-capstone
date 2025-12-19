/**
 * adminDashboard.js
 * Lógica para el panel de administración: gestión de médicos.
 */

import { openModal } from './components/modals.js';
import { getDoctors, filterDoctors, saveDoctor } from './services/doctorServices.js';
import { createDoctorCard } from './components/doctorCard.js';

// 1. Vinculación de Eventos
document.addEventListener('DOMContentLoaded', () => {
    // Cargar médicos al iniciar
    loadDoctorCards();

    // Botón Agregar Médico
    const addDocBtn = document.getElementById('addDocBtn');
    if (addDocBtn) {
        addDocBtn.addEventListener('click', () => {
            openModal('addDoctor');
        });
    }

    // Listeners de Filtros y Búsqueda
    const searchBar = document.getElementById("searchBar");
    const filterTime = document.getElementById("filterTime");
    const filterSpecialty = document.getElementById("filterSpecialty");

    if (searchBar) searchBar.addEventListener("input", filterDoctorsOnChange);
    if (filterTime) filterTime.addEventListener("change", filterDoctorsOnChange);
    if (filterSpecialty) filterSpecialty.addEventListener("change", filterDoctorsOnChange);
});

// 2. Función para cargar tarjetas de médicos
async function loadDoctorCards() {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "<p>Cargando médicos...</p>";

    try {
        const doctors = await getDoctors();
        renderDoctorCards(doctors);
    } catch (error) {
        console.error("Error loading doctors:", error);
        contentDiv.innerHTML = "<p>Error al cargar la lista de médicos.</p>";
    }
}

// 3. Renderizar tarjetas (Helper)
function renderDoctorCards(doctors) {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = ""; // Limpiar

    if (doctors.length === 0) {
        contentDiv.innerHTML = "<p>No se encontraron médicos.</p>";
        return;
    }

    doctors.forEach(doctor => {
        const card = createDoctorCard(doctor);
        contentDiv.appendChild(card);
    });
}

// 4. Lógica de Búsqueda y Filtrado
async function filterDoctorsOnChange() {
    const name = document.getElementById("searchBar").value;
    const time = document.getElementById("filterTime").value;
    const specialty = document.getElementById("filterSpecialty").value;

    try {
        const doctors = await filterDoctors(name, time, specialty);
        renderDoctorCards(doctors);
    } catch (error) {
        console.error("Error filtering doctors:", error);
    }
}

// 5. Manejar el Modal de Agregar Médico (Form Submission)
// Hacemos esta función global para que pueda ser llamada desde el onsubmit del formulario en el modal
window.adminAddDoctor = async function(event) {
    event.preventDefault(); // Evitar recarga de página

    // Recoger datos del formulario (IDs deben coincidir con tu HTML del modal)
    const name = document.getElementById('docName').value;
    const specialty = document.getElementById('docSpecialty').value;
    const email = document.getElementById('docEmail').value;
    const phone = document.getElementById('docPhone').value;
    const password = document.getElementById('docPassword').value;

    // Recoger Disponibilidad (Checkboxes)
    const checkboxes = document.querySelectorAll('input[name="availableTime"]:checked');
    let availableTimes = Array.from(checkboxes).map(cb => cb.value);

    // Crear objeto doctor
    const doctorData = {
        name,
        specialty,
        email,
        phone,
        password,
        availableTimes
    };

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Sesión no válida. Por favor inicie sesión nuevamente.");
        return;
    }

    try {
        const result = await saveDoctor(doctorData, token);
        if (result.success) {
            alert("Médico agregado exitosamente");
            // Cerrar modal (asumiendo que el modal tiene id 'modal')
            document.getElementById('modal').style.display = 'none';
            // Recargar lista
            loadDoctorCards();
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error saving doctor:", error);
        alert("Error inesperado al guardar el médico.");
    }
};