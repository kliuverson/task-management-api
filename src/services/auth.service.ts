import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AuthenticationError, ConflictError } from '../errors/AppError';
import { createUser, findUserByEmail, User } from '../persistence/user.repository';

const SALT_ROUNDS = 10;

export type PublicUser = Omit<User, 'password_hash'>;

// Quita el hash antes de devolver un usuario al cliente. 
function toPublicUser({ password_hash, ...rest }: User): PublicUser {
  return rest;
}

// Registra un usuario nuevo guardando solo el hash de su contraseña.
export async function register(
  nombre: string,
  email: string,
  password: string,
): Promise<PublicUser> {
  const normalizedEmail = email.trim().toLowerCase();

  if (await findUserByEmail(normalizedEmail)) {
    throw new ConflictError('El email ya está registrado');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser(nombre.trim(), normalizedEmail, passwordHash);
  return toPublicUser(user);
}

// Verifica credenciales y devuelve un JWT firmado. 
export async function login(
  email: string,
  password: string,
): Promise<{ token: string; user: PublicUser }> {
  const user = await findUserByEmail(email.trim().toLowerCase());
  const valid = user ? await bcrypt.compare(password, user.password_hash) : false;

  if (!user || !valid) {
    throw new AuthenticationError('Credenciales inválidas');
  }

  const token = jwt.sign({ sub: user.id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });

  return { token, user: toPublicUser(user) };
}