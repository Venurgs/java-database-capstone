# Arquitectura del Sistema de Gestión de Clínicas Inteligentes

## Sección 1: Resumen de la Arquitectura
El Sistema de Gestión de Clínicas Inteligentes (Smart Clinic) es una aplicación web de tres capas construida sobre Spring Boot. El sistema implementa una arquitectura híbrida que utiliza Spring MVC con plantillas Thymeleaf para renderizar vistas del lado del servidor (para paneles de administración y médicos) y APIs REST para exponer servicios a otros módulos y aplicaciones externas. La capa de persistencia es dual: utiliza MySQL (con Spring Data JPA) para gestionar datos relacionales estructurados como pacientes, doctores y citas, y MongoDB (con Spring Data MongoDB) para manejar documentos flexibles como las recetas médicas. Una capa de servicio centralizada orquesta la lógica de negocio y delega las tareas a los repositorios correspondientes.

## Sección 2: Flujo de Datos y Control
1. **Interacción de Usuario:** El usuario accede al sistema a través de un navegador (para los paneles Dashboard) o mediante un cliente externo (App móvil/Frontend) consumiendo las APIs.
2. **Enrutamiento del Controlador:** La solicitud HTTP llega al backend y es dirigida al controlador apropiado: un Controlador Thymeleaf (para vistas HTML) o un Controlador REST (para respuestas JSON).
3. **Capa de Servicio:** El controlador delega la lógica de negocio a la Capa de Servicio, donde se aplican las validaciones y reglas del negocio.
4. **Capa de Repositorio:** El servicio solicita operaciones de datos a la Capa de Repositorio, eligiendo entre el repositorio JPA (MySQL) o el repositorio Mongo según la entidad requerida.
5. **Acceso a Base de Datos:** Los repositorios ejecutan las consultas directamente contra las bases de datos: MySQL para datos estructurados (Usuarios, Citas) o MongoDB para documentos (Recetas).
6. **Vinculación de Modelos (Model Binding):** Los datos recuperados se transforman en objetos Java: Entidades JPA (con @Entity) o Documentos Mongo (con @Document).
7. **Respuesta:** Los objetos procesados se devuelven al cliente: integrados en una plantilla HTML renderizada por Thymeleaf o serializados como JSON en la respuesta HTTP.
