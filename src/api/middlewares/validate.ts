import Ajv, { AnySchema } from 'ajv';
import addFormats from 'ajv-formats';
import { RequestHandler } from 'express';
import { ValidationError } from '../../errors/AppError';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Crea un middleware que valida req.body contra un esquema JSON. 
export function validateBody(schema: AnySchema): RequestHandler {
  const validate = ajv.compile(schema);

  return (req, _res, next) => {
    if (!validate(req.body)) {
      const details = (validate.errors ?? []).map((e) => ({
        campo:
          e.instancePath.slice(1) ||
          e.params.missingProperty ||
          e.params.additionalProperty,
        mensaje: e.message,
      }));
      return next(new ValidationError('Datos inválidos', details));
    }
    next();
  };
}