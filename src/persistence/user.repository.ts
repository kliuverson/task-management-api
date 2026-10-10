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