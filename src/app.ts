import express from 'express';
import routes from './api/routes';
import { errorHandler, notFoundHandler } from './api/middlewares/errorHandler';

export const app = express();

app.use(express.json());
app.use('/', routes);
app.use(notFoundHandler);
app.use(errorHandler);