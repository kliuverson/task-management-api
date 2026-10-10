import { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError, NotFoundError, ValidationError } from '../../errors/AppError';

/** Convierte cualquier ruta inexistente en un NotFoundError (404). */
export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Ruta ${req.method} ${req.originalUrl} no encontrada`));
};
/**
 * Manejador central de errores: los AppError responden con su código HTTP y un JSON
 * uniforme; cualquier otro error se registra y responde 500 genérico, sin detalles internos.
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

  console.error(err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
  });
};