import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env';
import { AuthenticationError } from '../../errors/AppError';

/**
 * Protege rutas: exige `Authorization: Bearer <token>`, verifica la firma y la
 * expiración del JWT y deja el id del usuario en `req.userId`.
 * Responde 401 si el token falta, es inválido o expiró.
 */
export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AuthenticationError('Token no proporcionado'));
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (typeof payload === 'string' || !payload.sub) {
      return next(new AuthenticationError('Token inválido'));
    }
    req.userId = payload.sub;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AuthenticationError('Token expirado'));
    }
    next(new AuthenticationError('Token inválido'));
  }
};