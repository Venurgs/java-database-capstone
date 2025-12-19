/**
 * doctorCard.js
 * Crea un componente de tarjeta reutilizable para mostrar doctores.
 */

// Importamos servicios necesarios (aunque aún no existan, es la estructura correcta)
// Asegúrate de crear estos archivos vacíos o con la lógica básica en el siguiente paso
import { deleteDoctor } from "../services/doctorServices.js";
import { getPatientData } from "../services/patientServices.js";

// Función auxiliar para mostrar el modal de reserva (se definirá globalmente o importada)
function showBookingOverlay(event, doctor, patientData) {
    // Dispara un evento personalizado para que el controlador de la página (patientDashboard.js) abra el modal
    const bookingEvent = new CustomEvent('openBookingModal', {
        detail: { doctor: doctor, patient: patientData }
    });
    document.dispatchEvent(bookingEvent);
}

export function createDoctorCard(doctor) {
    // 1. Crear contenedor principal
    const card = document.createElement("div");
    card.classList.add("doctor-card");

    // Obtener rol actual
    const role = localStorage.getItem("userRole");

    // 2. Sección de Información
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("doctor-info");

    // Nombre
    const name = document.createElement("h3");
    name.textContent = doctor.name; // Asegúrate que tu JSON trae 'name'

    // Especialidad
    const specialty = document.createElement("p");
    specialty.innerHTML = `<strong>Especialidad:</strong> ${doctor.specialty}`;

    // Email
    const email = document.createElement("p");
    email.innerHTML = `<strong>Email:</strong> ${doctor.email}`;

    // Disponibilidad (si es un array o string)
    const availability = document.createElement("p");
    let availText = "No disponible";

    // Manejo robusto de availableTimes
    if (Array.isArray(doctor.availableTimes)) {
        availText = doctor.availableTimes.join(", ");
    } else if (typeof doctor.availableTimes === 'string') {
        availText = doctor.availableTimes; // En caso de que venga como string desde DB
    }

    availability.innerHTML = `<strong>Horarios:</strong> ${availText}`;

    // Añadir todo al infoDiv
    infoDiv.appendChild(name);
    infoDiv.appendChild(specialty);
    infoDiv.appendChild(email);
    infoDiv.appendChild(availability);

    // 3. Sección de Acciones (Botones)
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("card-actions");

    // Lógica condicional según rol
    if (role === "admin") {
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Eliminar";
        removeBtn.className = "button danger"; // Clase CSS para estilo rojo

        removeBtn.addEventListener("click", async () => {
            if (confirm(`¿Estás seguro de eliminar al Dr. ${doctor.name}?`)) {
                try {
                    const token = localStorage.getItem("token");
                    const success = await deleteDoctor(doctor.id, token);
                    if (success) {
                        card.remove(); // Eliminar del DOM visualmente
                        alert("Doctor eliminado correctamente");
                    } else {
                        alert("Error al eliminar el doctor");
                    }
                } catch (error) {
                    console.error("Error deleting doctor:", error);
                    alert("Ocurrió un error al intentar eliminar.");
                }
            }
        });
        actionsDiv.appendChild(removeBtn);

    } else if (role === "patient") {
        // Paciente visitante (no logueado)
        const bookNow = document.createElement("button");
        bookNow.textContent = "Reservar Ahora";
        bookNow.className = "button primary";

        bookNow.addEventListener("click", () => {
            alert("Debes iniciar sesión para reservar una cita.");
            // Opcional: abrir modal de login
            if (window.openModal) window.openModal('login');
        });
        actionsDiv.appendChild(bookNow);

    } else if (role === "loggedPatient") {
        // Paciente autenticado
        const bookNow = document.createElement("button");
        bookNow.textContent = "Reservar Cita";
        bookNow.className = "button primary confirm-btn";

        bookNow.addEventListener("click", async (e) => {
            try {
                const token = localStorage.getItem("token");
                // Obtenemos datos frescos del paciente para pre-llenar el formulario
                const patientData = await getPatientData(token);
                showBookingOverlay(e, doctor, patientData);
            } catch (error) {
                console.error("Error fetching patient data:", error);
                alert("Error al cargar datos para la reserva. Intente nuevamente.");
            }
        });
        actionsDiv.appendChild(bookNow);
    }

    // 4. Ensamblaje final
    card.appendChild(infoDiv);
    // Solo añadimos actionsDiv si tiene botones
    if (actionsDiv.hasChildNodes()) {
        card.appendChild(actionsDiv);
    }

    return card;
}