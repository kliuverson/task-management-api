import express from 'express';
import swaggerUi from 'swagger-ui-express';
import routes from './api/routes';
import { errorHandler, notFoundHandler } from './api/middlewares/errorHandler';
import { swaggerSpec } from './config/swagger';
/**
 * Aplicación Express: registra el JSON, la documentación Swagger (/docs) y las rutas.
 * Los manejadores de errores van al final para atrapar lo que falle antes.
 */
export const app = express();

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', routes);
app.use(notFoundHandler);
app.use(errorHandler);