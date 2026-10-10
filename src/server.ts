import { config } from './config/env';
import { checkConnection } from './persistence/db';

checkConnection()
  .then(() => console.log(`Conectado a ${config.db.database}`))
  .catch((err) => console.error('Error de conexión:', err.message))
  .finally(() => process.exit());