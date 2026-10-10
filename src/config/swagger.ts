import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
/** Patrón donde swagger-jsdoc busca los comentarios de las rutas, con barras normales para que funcione en Windows. */
const routesGlob = path
  .join(__dirname, '../api/routes/*.{ts,js}')
  .replace(/\\/g, '/');
/** Especificación OpenAPI: datos generales, esquemas reutilizables y seguridad. */
export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description:
        'API REST para registrar usuarios y administrar sus tareas personales. ' +
        'PUT /tasks/{id} acepta actualizaciones parciales.',
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string', example: 'Datos inválidos' },
                details: { type: 'array', items: { type: 'object' } },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string', example: 'Ana' },
            email: { type: 'string', format: 'email', example: 'ana@mail.com' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['nombre', 'email', 'password'],
          properties: {
            nombre: { type: 'string', maxLength: 100, example: 'Ana' },
            email: { type: 'string', format: 'email', example: 'ana@mail.com' },
            password: { type: 'string', minLength: 12, maxLength: 64, example: 'clavesegura123' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'ana@mail.com' },
            password: { type: 'string', example: 'clavesegura123' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            titulo: { type: 'string', example: 'Probar API' },
            descripcion: { type: 'string', nullable: true },
            fecha_vencimiento: { type: 'string', format: 'date-time', nullable: true },
            estado: { type: 'string', enum: ['pendiente', 'en curso', 'completada'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        TaskCreate: {
          type: 'object',
          required: ['titulo'],
          properties: {
            titulo: { type: 'string', maxLength: 200, example: 'Probar API' },
            descripcion: { type: 'string', maxLength: 2000, nullable: true },
            fecha_vencimiento: { type: 'string', format: 'date-time', nullable: true },
            estado: { type: 'string', enum: ['pendiente', 'en curso', 'completada'] },
          },
        },
        TaskUpdate: {
          type: 'object',
          minProperties: 1,
          description: 'Solo se modifican los campos enviados. null borra descripcion o fecha_vencimiento.',
          properties: {
            titulo: { type: 'string', maxLength: 200 },
            descripcion: { type: 'string', maxLength: 2000, nullable: true },
            fecha_vencimiento: { type: 'string', format: 'date-time', nullable: true },
            estado: { type: 'string', enum: ['pendiente', 'en curso', 'completada'] },
          },
        },
      },
    },
  },
  // Lee los comentarios @openapi de las rutas (.ts en desarrollo, .js tras compilar).
    apis: [routesGlob],
});