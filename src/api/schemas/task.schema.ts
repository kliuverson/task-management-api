const ESTADOS = ['pendiente', 'en curso', 'completada'];

/** Esquema del cuerpo de POST /tasks. */
export const createTaskSchema = {
  type: 'object',
  properties: {
    titulo: { type: 'string', minLength: 1, maxLength: 200, pattern: '\\S' },
    descripcion: { type: ['string', 'null'], maxLength: 2000 },
    fecha_vencimiento: { type: ['string', 'null'], format: 'date-time' },
    estado: { type: 'string', enum: ESTADOS },
  },
  required: ['titulo'],
  additionalProperties: false,
} as const;

/** Esquema del cuerpo de PUT /tasks/:id (actualización parcial). */
export const updateTaskSchema = {
  type: 'object',
  properties: {
    titulo: { type: 'string', minLength: 1, maxLength: 200, pattern: '\\S' },
    descripcion: { type: ['string', 'null'], maxLength: 2000 },
    fecha_vencimiento: { type: ['string', 'null'], format: 'date-time' },
    estado: { type: 'string', enum: ESTADOS },
  },
  minProperties: 1,
  additionalProperties: false,
} as const;

/** Esquema del parámetro :id de las rutas /tasks/:id. */
export const taskIdParamSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
  },
  required: ['id'],
} as const;