import { Pool } from 'pg';
import { config } from '../config/env';

/** Pool de conexiones a PostgreSQL, compartido por toda la aplicación. */
export const pool = new Pool(config.db);

/** Verifica que la base de datos responde; lanza un error si no hay conexión. */
export async function checkConnection(): Promise<void> {
  await pool.query('SELECT 1');
}