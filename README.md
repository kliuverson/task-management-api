# Task Management API

API RESTful para registrar usuarios, iniciar sesión y administrar tareas personales. Cada usuario solo puede ver y modificar sus propias tareas.

## Tecnologías

- Node.js + Express
- TypeScript
- PostgreSQL (librería `pg`)
- JWT (`jsonwebtoken`) y bcrypt (`bcryptjs`)
- AJV para validación con JSON Schema
- Swagger (`swagger-jsdoc` + `swagger-ui-express`)

## Arquitectura

El proyecto está organizado en capas con responsabilidades separadas:

```
src/
├── api/
│   ├── routes/         Definición de rutas y su documentación Swagger
│   ├── middlewares/    authenticate (JWT), validate (AJV), errorHandler
│   └── schemas/        Esquemas JSON Schema de entrada
├── controllers/        Traducen HTTP: leen la petición y arman la respuesta
├── services/           Lógica de negocio (hash, JWT, reglas de propiedad)
├── persistence/        Consultas SQL y conexión a la base de datos
├── config/             Variables de entorno (Singleton) y configuración de Swagger
├── errors/             Clases de error personalizadas
├── types/              Extensiones de tipos de Express
├── app.ts              Arma la aplicación Express
└── server.ts           Comprueba la base de datos y arranca el servidor
```

Flujo de una petición: `ruta → middlewares (autenticación y validación) → controlador → servicio → persistencia`. Cualquier error se lanza como una clase de error personalizada y lo convierte en JSON el manejador central.

## Requisitos

- Node.js 20 o superior
- PostgreSQL 13 o superior
- npm

## Instalación local

1. Clona el repositorio e instala las dependencias:

   ```bash
   git clone https://github.com/kliuverson/task-management-api.git
   cd task-management-api
   npm install
   ```

2. Crea la base de datos:

   ```bash
   psql -U postgres -c "CREATE DATABASE taskdb;"
   ```

3. Crea las tablas ejecutando el esquema:

   ```bash
   psql -U postgres -d taskdb -f src/persistence/schema.sql
   ```

4. Configura las variables de entorno (ver la sección siguiente).

5. Inicia el servidor en modo desarrollo:

   ```bash
   npm run dev
   ```

La API queda disponible en `http://localhost:3000`.

## Configuración (`.env`)

Copia el archivo de ejemplo y completa tus valores:

```bash
cp .env.example .env          # Mac, Linux o Git Bash
Copy-Item .env.example .env   # PowerShell
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno | `development` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USER` | Usuario de la base de datos | `postgres` |
| `DB_PASSWORD` | Contraseña de la base de datos | (la tuya) |
| `DB_NAME` | Nombre de la base de datos | `taskdb` |
| `JWT_SECRET` | Clave para firmar los tokens (usa una cadena larga y aleatoria) | (la tuya) |
| `JWT_EXPIRES_IN` | Duración del token | `1h` |

El archivo `.env` no se sube al repositorio. La aplicación valida las variables obligatorias al arrancar y falla con un mensaje claro si falta alguna.

Para generar un `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor en modo desarrollo con recarga automática |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta la versión compilada |

## Documentación de la API

Con el servidor corriendo, abre Swagger en:

**http://localhost:3000/docs**

Para probar los endpoints protegidos: inicia sesión en `POST /auth/login`, copia el `token`, pulsa **Authorize** y pégalo (sin escribir `Bearer`).

## Endpoints

| Método | Ruta | Descripción | Autenticación |
|---|---|---|---|
| GET | `/health` | Comprueba que la API está viva | No |
| POST | `/auth/register` | Registra un usuario | No |
| POST | `/auth/login` | Inicia sesión y devuelve un JWT | No |
| POST | `/tasks` | Crea una tarea | Sí |
| GET | `/tasks` | Lista las tareas del usuario | Sí |
| GET | `/tasks/:id` | Consulta una tarea propia | Sí |
| PUT | `/tasks/:id` | Actualiza una tarea propia (parcial) | Sí |
| DELETE | `/tasks/:id` | Elimina una tarea propia | Sí |

Las rutas protegidas exigen la cabecera `Authorization: Bearer <token>`.

### Modelo de tarea

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | Generado por la base de datos |
| `titulo` | texto | Obligatorio, hasta 200 caracteres |
| `descripcion` | texto | Opcional |
| `fecha_vencimiento` | fecha ISO 8601 | Opcional, por ejemplo `2026-12-31T23:59:00Z` |
| `estado` | texto | `pendiente` (por defecto), `en curso` o `completada` |

## Formato de errores

Todos los errores usan la misma estructura:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos inválidos",
    "details": [{ "campo": "password", "mensaje": "must NOT have fewer than 12 characters" }]
  }
}
```

| Código HTTP | `code` | Cuándo ocurre |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Datos o id inválidos |
| 401 | `AUTHENTICATION_ERROR` | Token ausente, inválido o expirado, o credenciales incorrectas |
| 404 | `NOT_FOUND` | Ruta inexistente, o tarea que no existe o no pertenece al usuario |
| 409 | `CONFLICT` | El email ya está registrado |
| 500 | `INTERNAL_ERROR` | Error inesperado del servidor |

## Decisiones de diseño

- **Contraseñas:** mínimo de 12 caracteres, sin reglas de composición; máximo de 64 por el límite de 72 bytes de bcrypt. Se guardan solo como hash.
- **Token JWT:** dura 1 hora y no hay renovación automática; hay que iniciar sesión de nuevo al expirar.
- **Autorización por propietario:** todas las consultas de tareas filtran por `user_id`. Una tarea ajena responde 404 y no 403, para no revelar que existe.
- **`PUT` parcial:** solo se modifican los campos enviados. Un `null` explícito borra `descripcion` o `fecha_vencimiento`.

## Bitácora de desarrollo

El proceso, el uso de IA, las decisiones y los retos están en [DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md).