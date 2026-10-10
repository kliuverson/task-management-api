// Esquema del cuerpo de POST /auth/register.
export const registerSchema = {
  type: 'object',
  properties: {
    nombre: { type: 'string', minLength: 1, maxLength: 100, pattern: '\\S' },
    email: { type: 'string', format: 'email', maxLength: 255 },
    // Mínimo 12 (decisión propia). El máximo evita el límite de 72 bytes de bcrypt.
    password: { type: 'string', minLength: 12, maxLength: 64 },
  },
  required: ['nombre', 'email', 'password'],
  additionalProperties: false,
} as const;

// Esquema del cuerpo de POST /auth/login. 
export const loginSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', maxLength: 255 },
    password: { type: 'string', minLength: 1, maxLength: 64 },
  },
  required: ['email', 'password'],
  additionalProperties: false,
} as const;