import { pool } from './db';

export interface User {
  id: string;
  nombre: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

// Inserta un usuario y devuelve el registro creado. 
export async function createUser(
  nombre: string,
  email: string,
  passwordHash: string,
): Promise<User> {
  const { rows } = await pool.query<User>(
    'INSERT INTO users (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
    [nombre, email, passwordHash],
  );
  return rows[0];
}

// Busca un usuario por email; devuelve null si no existe. 
export async function findUserByEmail(email: string): Promise<User | null> {
  const { rows } = await pool.query<User>(
    'SELECT * FROM users WHERE email = $1',
    [email],
  );
  return rows[0] ?? null;
}
/** Nombre de la restricción UNIQUE del email, definida en schema.sql. */
export const EMAIL_UNIQUE_CONSTRAINT = 'users_email_key';

/** Indica si un error de pg es una violación de unicidad (23505) de la restricción dada. */
export function isUniqueViolation(err: unknown, constraint: string): boolean {
  const e = err as { code?: string; constraint?: string } | null;
  return e?.code === '23505' && e?.constraint === constraint;
}