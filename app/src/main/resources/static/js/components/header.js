/**
 * header.js
 * Renderiza el encabezado dinámicamente según el rol del usuario.
 */

function renderHeader() {
    // 1. Verificar si estamos en la página de inicio (Landing Page)
    // Si es así, limpiamos la sesión (logout automático al volver al inicio)
    if (window.location.pathname.endsWith("/") || window.location.pathname.endsWith("index.html")) {
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        // No renderizamos header en la landing page
        return;
    }

    const headerDiv = document.getElementById("header");
    if (!headerDiv) return; // Si no hay contenedor, salir

    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    // 2. Verificación de Seguridad:
    // Si tiene un rol que requiere login pero no tiene token, lo echamos fuera.
    // (Excepto 'patient' que es el rol de visitante no logueado)
    if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
        localStorage.removeItem("userRole");
        alert("Sesión expirada o inicio de sesión inválido. Por favor, inicie sesión nuevamente.");
        window.location.href = "/";
        return;
    }

    let headerContent = "";

    // Logo común para todos
    const logoHtml = `
        <div class="logo-section">
            <img src="../assets/images/logo/logo.png" alt="Smart Clinic Logo" class="header-logo">
            <h1>Smart Clinic</h1>
        </div>
    `;

    // 3. Inyección de HTML según el rol
    let navContent = "";

    if (role === "admin") {
        navContent = `
            <div class="nav-buttons">
                <button id="addDocBtn" class="adminBtn button">Agregar Doctor</button>
                <a href="#" id="logoutBtn" class="logout-link">Cerrar sesión</a>
            </div>
        `;
    } else if (role === "doctor") {
        navContent = `
             <div class="nav-buttons">
                <span class="welcome-text">Bienvenido, Doctor</span>
                <a href="#" id="logoutBtn" class="logout-link">Cerrar sesión</a>
            </div>
        `;
    } else if (role === "patient") {
        // Paciente visitante (desde la landing page)
        navContent = `
             <div class="nav-buttons">
                <button id="loginBtn" class="button">Iniciar sesión</button>
                <button id="registerBtn" class="button outline">Registrarse</button>
                <a href="/" class="home-link">Inicio</a>
            </div>
        `;
    } else if (role === "loggedPatient") {
        navContent = `
             <div class="nav-buttons">
                <a href="/pages/patientDashboard.html" class="nav-link">Inicio</a>
                <a href="/pages/patientAppointments.html" class="nav-link">Mis Citas</a>
                <a href="/pages/patientRecord.html" class="nav-link">Historial</a>
                <a href="#" id="logoutPatientBtn" class="logout-link">Cerrar sesión</a>
            </div>
        `;
    } else {
        // Fallback por si acaso
        navContent = `<a href="/" class="home-link">Volver al Inicio</a>`;
    }

    headerDiv.innerHTML = `
        <header class="header">
            ${logoHtml}
            ${navContent}
        </header>
    `;

    // 4. Adjuntar Listeners (Eventos) después de crear el HTML
    attachHeaderButtonListeners(role);
}

function attachHeaderButtonListeners(role) {
    // Listener para Admin: Agregar Doctor (abre modal)
    const addDocBtn = document.getElementById("addDocBtn");
    if (addDocBtn) {
        // Asumimos que existe una función openModal global o importada
        // Para este paso, usaremos un dispatchEvent o llamada directa si existe
        addDocBtn.addEventListener("click", () => {
            if (window.openModal) window.openModal('addDoctor');
        });
    }

    // Listener para Logout General (Admin y Doctor)
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    // Listener para Logout de Paciente
    const logoutPatientBtn = document.getElementById("logoutPatientBtn");
    if (logoutPatientBtn) {
        logoutPatientBtn.addEventListener("click", logoutPatient);
    }

    // Listeners para Paciente Visitante (Login/Register)
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            if (window.openModal) window.openModal('login');
        });
    }

    const registerBtn = document.getElementById("registerBtn");
    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            if (window.openModal) window.openModal('register');
        });
    }
}

// 5. Funciones de Logout
function logout() {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    window.location.href = "/";
}

function logoutPatient() {
    localStorage.removeItem("token");
    // Al hacer logout, el paciente vuelve a ser un "visitante"
    localStorage.setItem("userRole", "patient");
    window.location.href = "/pages/patientDashboard.html";
}

// Ejecutar al cargar
document.addEventListener("DOMContentLoaded", renderHeader);