import { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError, NotFoundError, ValidationError } from '../../errors/AppError';

/** Convierte cualquier ruta inexistente en un NotFoundError (404). */
export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Ruta ${req.method} ${req.originalUrl} no encontrada`));
};

/** Indica si el error viene de express.json() por un cuerpo con JSON mal formado. */
function isMalformedJson(err: unknown): boolean {
  return (err as { type?: string } | null)?.type === 'entity.parse.failed';
}

/**
 * Manejador central de errores: los AppError responden con su código HTTP y un JSON
 * uniforme; un JSON mal formado responde 400; cualquier otro error se registra y
 * responde 500 genérico, sin detalles internos.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err instanceof ValidationError ? err.details : undefined,
      },
    });
    return;
  }

  if (isMalformedJson(err)) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'El cuerpo de la petición no es un JSON válido',
      },
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
  });
};