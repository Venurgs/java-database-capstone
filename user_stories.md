# Historias de Usuario - Smart Clinic System

## 1. Historias de Usuario del Administrador
**Como** Administrador del sistema,
**Quiero** gestionar las cuentas de usuarios y la configuración de la clínica,
**Para** asegurar que el sistema sea seguro y que los datos médicos estén organizados.

* **Historia 1.1:** Como administrador, quiero registrar nuevos doctores en el sistema ingresando su especialidad y correo electrónico, para que puedan atender pacientes.
* **Historia 1.2:** Como administrador, quiero ver una lista de todos los pacientes registrados, para poder gestionar sus datos de contacto si es necesario.
* **Historia 1.3:** Como administrador, quiero eliminar o desactivar usuarios que ya no trabajan en la clínica, para mantener la seguridad del sistema.
* **Historia 1.4:** Como administrador, quiero restablecer las contraseñas de los usuarios que las han olvidado, para que puedan recuperar el acceso a sus cuentas.
* **Historia 1.5:** Como administrador, quiero asignar roles específicos (personal administrativo, doctor) a los nuevos empleados, para garantizar que tengan los permisos correctos en el sistema.

## 2. Historias de Usuario del Paciente
**Como** Paciente,
**Quiero** reservar citas y acceder a mi historial médico en línea,
**Para** ahorrar tiempo y gestionar mi salud sin tener que llamar a la clínica.

* **Historia 2.1:** Como paciente, quiero ver los horarios disponibles de los doctores filtrando por especialidad, para poder elegir el momento y médico adecuado.
* **Historia 2.2:** Como paciente, quiero reservar una cita con un doctor específico, para asegurar mi atención médica.
* **Historia 2.3:** Como paciente, quiero ver mi historial de recetas médicas anteriores, para recordar qué medicamentos me fueron recetados (Consultando MongoDB).
* **Historia 2.4:** Como paciente, quiero poder cancelar una cita agendada si me surge un imprevisto, para liberar el horario para otro paciente.
* **Historia 2.5:** Como paciente, quiero actualizar mi información personal (teléfono, dirección), para que la clínica pueda contactarme correctamente.

## 3. Historias de Usuario del Doctor
**Como** Doctor,
**Quiero** gestionar mi agenda y emitir recetas,
**Para** atender a mis pacientes de manera eficiente y mantener un registro de sus tratamientos.

* **Historia 3.1:** Como doctor, quiero establecer mis bloques horarios de disponibilidad semanal, para que los pacientes sepan cuándo pueden reservar.
* **Historia 3.2:** Como doctor, quiero ver una lista detallada de mis citas programadas para el día actual, para prepararme para cada consulta.
* **Historia 3.3:** Como doctor, quiero crear y guardar recetas digitales para un paciente, asegurando que se almacenen en la base de datos de documentos (MongoDB).
* **Historia 3.4:** Como doctor, quiero marcar una cita como "Completada" después de la consulta, para llevar un control de mi flujo de trabajo.
* **Historia 3.5:** Como doctor, quiero buscar el historial clínico de un paciente específico antes de que entre a consulta, para tener contexto sobre su salud previa.
