import { app } from './app';
import { config } from './config/env';
import { checkConnection } from './persistence/db';
/** Comprueba la conexión a la base de datos y, si responde, arranca el servidor en el puerto configurado. */
async function bootstrap(): Promise<void> {
  await checkConnection();
  app.listen(config.port, () => {
    console.log(`API escuchando en http://localhost:${config.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('No se pudo iniciar la API:', err);
  process.exit(1);
});