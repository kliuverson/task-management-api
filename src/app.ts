import express from 'express';
import swaggerUi from 'swagger-ui-express';
import routes from './api/routes';
import { errorHandler, notFoundHandler } from './api/middlewares/errorHandler';
import { swaggerSpec } from './config/swagger';

export const app = express();

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', routes);
app.use(notFoundHandler);
app.use(errorHandler);