/** Error base de la aplicación: lleva un código HTTP y un código interno estable. */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
/** 400: los datos de entrada no cumplen el esquema; `details` lista los campos. */
export class ValidationError extends AppError {
  constructor(message = 'Datos inválidos', public readonly details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}
/** 401: token ausente, inválido o expirado, o credenciales incorrectas. */
export class AuthenticationError extends AppError {
  constructor(message = 'No autenticado') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}
/** 404: el recurso no existe o no pertenece al usuario (se responde igual para no revelarlo). */
export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND');
  }
}
/** 409: el recurso ya existe (por ejemplo, un email ya registrado). */
export class ConflictError extends AppError {
  constructor(message = 'El recurso ya existe') {
    super(message, 409, 'CONFLICT');
  }
}