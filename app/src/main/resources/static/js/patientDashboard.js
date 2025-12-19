/**
 * patientDashboard.js
 * Lógica para el panel del paciente: ver doctores, login y registro.
 */

import { createDoctorCard } from './components/doctorCard.js';
import { openModal } from './components/modals.js';
import { getDoctors, filterDoctors } from './services/doctorServices.js';
import { patientLogin, patientSignup } from './services/patientServices.js';

// 1. Cargar Tarjetas al iniciar
document.addEventListener("DOMContentLoaded", () => {
    loadDoctorCards();

    // Vinculación de botones de Auth (si existen en el header/página)
    const signupBtn = document.getElementById("patientSignup"); // Asegúrate de que este ID exista en tu HTML (o header)
    if (signupBtn) signupBtn.addEventListener("click", () => openModal("patientSignup"));

    const loginBtn = document.getElementById("patientLogin"); // Asegúrate de que este ID exista en tu HTML (o header)
    if (loginBtn) loginBtn.addEventListener("click", () => openModal("patientLogin"));

    // Listeners de Filtros
    const searchBar = document.getElementById("searchBar");
    const filterTime = document.getElementById("filterTime");
    const filterSpecialty = document.getElementById("filterSpecialty");

    if (searchBar) searchBar.addEventListener("input", filterDoctorsOnChange);
    if (filterTime) filterTime.addEventListener("change", filterDoctorsOnChange);
    if (filterSpecialty) filterSpecialty.addEventListener("change", filterDoctorsOnChange);
});

// 2. Funciones de Carga y Filtrado
async function loadDoctorCards() {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "<p>Cargando doctores...</p>";
    try {
        const doctors = await getDoctors();
        renderDoctorCards(doctors);
    } catch (error) {
        contentDiv.innerHTML = "<p>Error al cargar doctores.</p>";
    }
}

async function filterDoctorsOnChange() {
    const name = document.getElementById("searchBar").value;
    const time = document.getElementById("filterTime").value;
    const specialty = document.getElementById("filterSpecialty").value;
    const contentDiv = document.getElementById("content");

    try {
        const doctors = await filterDoctors(name, time, specialty);
        renderDoctorCards(doctors);
    } catch (error) {
        contentDiv.innerHTML = "<p>Error al filtrar.</p>";
    }
}

function renderDoctorCards(doctors) {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    if (!doctors || doctors.length === 0) {
        contentDiv.innerHTML = "<p>No se encontraron doctores con los filtros dados.</p>";
        return;
    }

    doctors.forEach(doc => {
        const card = createDoctorCard(doc);
        contentDiv.appendChild(card);
    });
}

// 3. Manejo de Registro (Signup) - Global para usar en onsubmit
window.signupPatient = async function(event) {
    if(event) event.preventDefault();

    // Recoger datos del formulario modal
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const phone = document.getElementById("regPhone").value;
    const address = document.getElementById("regAddress").value;

    const data = { name, email, password, phone, address };

    try {
        const result = await patientSignup(data);
        if (result.success) {
            alert("Registro exitoso. Por favor inicie sesión.");
            document.getElementById('modal').style.display = 'none'; // Cerrar modal
            // Opcional: abrir modal de login automáticamente
            openModal("patientLogin");
        } else {
            alert("Error en el registro: " + result.message);
        }
    } catch (error) {
        console.error("Signup error:", error);
        alert("Error de conexión.");
    }
};

// 4. Manejo de Login - Global para usar en onsubmit
window.loginPatient = async function(event) {
    if(event) event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await patientLogin({ email, password });
        if (response.ok) {
            const data = await response.json();
            // Guardar token y rol
            localStorage.setItem("token", data.token || "dummy-token");
            localStorage.setItem("userRole", "loggedPatient");

            // Redirigir al dashboard privado
            window.location.href = "/pages/patientDashboard.html"; // O loggedPatientDashboard.html si existe separada
        } else {
            alert("Credenciales inválidas.");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Error de conexión.");
    }
};