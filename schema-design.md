# Diseño de Esquema de Base de Datos - Smart Clinic

Este documento define la arquitectura de datos híbrida para el sistema. Utilizamos **MySQL** para datos relacionales estructurados (integridad referencial estricta) y **MongoDB** para documentos flexibles (estructuras anidadas).

---

## 1. Diseño de Esquema MySQL (Datos Relacionales)
Estas tablas gestionarán las entidades principales que requieren relaciones estrictas y transaccionalidad.

### Tabla: `patients` (Pacientes)
Almacena la información personal de los usuarios que reciben atención.
| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | INT | **PK**, AUTO_INCREMENT | Identificador único del paciente. |
| `first_name` | VARCHAR(50) | NOT NULL | Nombre del paciente. |
| `last_name` | VARCHAR(50) | NOT NULL | Apellido del paciente. |
| `email` | VARCHAR(100) | **UNIQUE**, NOT NULL | Correo para contacto y login. |
| `phone` | VARCHAR(20) | NULL | Número de contacto telefónico. |
| `date_of_birth`| DATE | NOT NULL | Necesario para historial médico. |

### Tabla: `doctors` (Doctores)
Almacena a los profesionales médicos y sus especialidades.
| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | INT | **PK**, AUTO_INCREMENT | Identificador único del doctor. |
| `first_name` | VARCHAR(50) | NOT NULL | Nombre del doctor. |
| `last_name` | VARCHAR(50) | NOT NULL | Apellido del doctor. |
| `specialty` | VARCHAR(50) | NOT NULL | Especialidad (ej: Cardiología). |
| `email` | VARCHAR(100) | **UNIQUE**, NOT NULL | Correo corporativo del doctor. |

### Tabla: `appointments` (Citas)
Tabla pivote que conecta pacientes y doctores en un momento específico.
| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | INT | **PK**, AUTO_INCREMENT | Identificador único de la cita. |
| `patient_id` | INT | **FK** (Ref: patients.id) | Paciente que solicita la cita. |
| `doctor_id` | INT | **FK** (Ref: doctors.id) | Doctor asignado. |
| `appointment_time`| DATETIME | NOT NULL | Fecha y hora exacta de la cita. |
| `status` | VARCHAR(20) | DEFAULT 'Scheduled' | Estado (Scheduled, Completed, Cancelled). |

### Tabla: `administrators` (Administradores)
Usuarios con permisos elevados para gestionar el sistema.
| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | INT | **PK**, AUTO_INCREMENT | Identificador único del admin. |
| `username` | VARCHAR(50) | **UNIQUE**, NOT NULL | Nombre de usuario para login. |
| `password_hash`| VARCHAR(255)| NOT NULL | Contraseña encriptada (seguridad). |
| `role` | VARCHAR(20) | DEFAULT 'ADMIN' | Rol para gestión de permisos Spring. |

---

## 2. Diseño de Colección MongoDB (Datos No Estructurados)
Utilizamos MongoDB para datos que varían en tamaño o estructura, como las recetas médicas que contienen listas de medicamentos.

### Colección: `prescriptions` (Recetas)
Esta colección almacena los detalles del diagnóstico y los medicamentos recetados tras una cita.

**Justificación del diseño:**
* Usamos MongoDB porque una receta contiene una **lista (array)** de medicamentos.
* En SQL, esto requeriría una tabla extra (`prescription_items`) y JOINS complejos.
* En MongoDB, podemos guardar la lista completa dentro del mismo documento, lo que hace la lectura mucho más rápida para la aplicación.

#### Ejemplo de Documento JSON (Estructura de Datos)

```json
{
  "_id": "64c9e3b2a1b2c3d4e5f6g7h8",
  "appointmentId": 101,
  "patientId": 5,
  "doctorId": 3,
  "diagnosis": "Infección respiratoria aguda",
  "notes": "El paciente presenta fiebre leve y tos seca. Se recomienda reposo.",
  "status": "Active",
  "medicationList": [
    {
      "name": "Amoxicilina",
      "dosage": "500mg",
      "frequency": "Cada 8 horas",
      "duration": "7 días"
    },
    {
      "name": "Ibuprofeno",
      "dosage": "400mg",
      "frequency": "Cada 6 horas si hay fiebre",
      "duration": "3 días"
    }
  ],
  "issuedAt": "2025-10-27T14:30:00Z"
}
