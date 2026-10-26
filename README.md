# Aplicaciones y Servicios Web - ITM

**Estudiantes:** Jonathan Moreno Acosta y Julissa Castrillón Ríos
**Asignatura:** Aplicaciones y Servicios Web
**Actividad:** Integración de Auth0 con Node.js y Express

## Descripción del Proyecto
Este repositorio contiene el desarrollo de la actividad práctica de Auth0. Se implementó una aplicación local con Node.js y Express que incluye:
1. **Autenticación Local:** Flujo de login/logout usando el SDK oficial de Auth0.
2. **Personalización (Branding):** Configuración del Universal Login con el logo institucional del ITM.
3. **Modificación de Datos:** Formulario prellenado con los datos actuales del `user_metadata`.
4. **Consumo de API (M2M):** Uso de la API de Management de Auth0 con un token de Máquina a Máquina para actualizar el `user_metadata` del usuario.

## Tecnologías Usadas
* Node.js & Express
* Auth0 (`express-openid-connect`)
* EJS (Motor de plantillas)
* Axios (Consumo de API)

## Instrucciones de ejecución local
1. Clonar el repositorio.
2. Ejecutar `npm install`.
3. Crear un archivo `.env` y configurar las credenciales de Auth0 (App Regular Web y App M2M).
4. Ejecutar `npm start` y abrir `http://localhost:3000`.
