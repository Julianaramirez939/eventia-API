# Eventia Core API

## Introducción
Eventia Core API es un sistema backend para administrar eventos, participantes y asistencia. Permite crear, actualizar, eliminar y consultar eventos y participantes, así como registrar la asistencia de los participantes a cada evento. También incluye estadísticas de asistencia y caché opcional mediante Redis.

---

## Arquitectura
- **Node.js + Express:** Servidor y rutas REST.
- **Sequelize ORM con PostgreSQL:** Persistencia de datos.
- **Redis (opcional):** Caché para estadísticas y validaciones rápidas.
- **Pruebas con Jest y Supertest:** Unitarias e integración.
- **CI/CD con GitHub Actions:** Pipeline automatizado.

---

## Requisitos
- Node.js >= 18
- PostgreSQL
- Redis o Memurai (opcional, para caché)
- npm

---

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repo>
cd eventia-core-api

2. Instalar dependencias:
npm install

3. Configurar archivo .env en la raíz:
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eventia_db
DB_USER=postgres
DB_PASS=1234
REDIS_URL=redis://localhost:6379
NODE_ENV=development

4. Ejecutar migraciones o asegurarse de que las tablas existan en PostgreSQL.
5. Iniciar servidor en modo desarrollo: `npm run dev`
## Endpoints principales
### Eventos
- POST /events: Crear un evento
- GET /events: Listar eventos
- GET /events/:id: Obtener evento por ID
- PUT /events/:id: Actualizar evento
- DELETE /events/:id: Eliminar evento
- GET /events/:id/stats: Obtener estadísticas de asistencia
### Participantes
- POST /participants: Crear participante
- GET /participants: Listar participantes
- GET /participants/:id: Obtener participante por ID
- PUT /participants/:id: Actualizar participante
- DELETE /participants/:id: Eliminar participante
### Asistencias
- POST /attendance: Registrar asistencia
- GET /attendance: Listar asistencias
- GET /attendance/:id: Obtener asistencia por ID
- PUT /attendance/:id: Actualizar asistencia
- DELETE /attendance/:id: Eliminar asistencia
## Pruebas
- Unitarias: `npm run test:unit`
- Integración: `npm run test:integration`
- End-to-End: `npm run test:e2e`
## Análisis estático de seguridad
Se recomienda ejecutar ESLint con reglas de seguridad: `npm run lint`
## CI/CD con GitHub Actions
El workflow ejecuta automáticamente: instalación de dependencias, pruebas unitarias, pruebas de integración, análisis estático y pruebas de sistema. Si todo pasa, imprime **OK**, de lo contrario el pipeline falla.
## Código Limpio
- Nombres descriptivos
- Modularidad y responsabilidad única
- Manejo de errores
- Evitar duplicación de código
## Justificación Tecnológica
- Node.js + Express: rápido, escalable y estándar para APIs REST.
- PostgreSQL: base de datos relacional confiable.
- Redis/Memurai: caché opcional para mejorar rendimiento de estadísticas.
- Jest + Supertest: pruebas unitarias e integración confiables.
- GitHub Actions: CI/CD automatizado.

