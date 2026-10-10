import Ajv, { AnySchema } from 'ajv';
import addFormats from 'ajv-formats';
import { Request, RequestHandler } from 'express';
import { ValidationError } from '../../errors/AppError';

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
addFormats(ajv);
/**
 * Compila el esquema una sola vez y devuelve un middleware que valida la parte de la
 * petición indicada. Si no cumple, pasa un ValidationError con el detalle por campo.
 */
function buildValidator(
  schema: AnySchema,
  getData: (req: Request) => unknown,
): RequestHandler {
  const validate = ajv.compile(schema);

  return (req, _res, next) => {
    if (!validate(getData(req))) {
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

/** Valida `req.body` contra un esquema JSON. */
export const validateBody = (schema: AnySchema): RequestHandler =>
  buildValidator(schema, (req) => req.body);

/**
 * Valida `req.params` (por ejemplo, el :id de la ruta) contra un esquema JSON.
 */
export const validateParams = (schema: AnySchema): RequestHandler =>
  buildValidator(schema, (req) => req.params);