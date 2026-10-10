import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AuthenticationError, ConflictError } from '../errors/AppError';
import {
  createUser,
  EMAIL_UNIQUE_CONSTRAINT,
  findUserByEmail,
  isUniqueViolation,
  User,
} from '../persistence/user.repository';

const SALT_ROUNDS = 10;
/**
 * Hash falso con el mismo costo que los reales. Se compara cuando el email no existe
 * para que el login tarde parecido exista o no la cuenta.
 */
const DUMMY_HASH = bcrypt.hashSync('contraseña-que-nadie-usa', SALT_ROUNDS);
export type PublicUser = Omit<User, 'password_hash'>;

// Quita el hash antes de devolver un usuario al cliente. 
function toPublicUser({ password_hash, ...rest }: User): PublicUser {
  return rest;
}

// Registra un usuario nuevo guardando solo el hash de su contraseña.
/** Registra un usuario nuevo guardando solo el hash de su contraseña. */
export async function register(
  nombre: string,
  email: string,
  password: string,
): Promise<PublicUser> {
  const normalizedEmail = email.trim().toLowerCase();

  // Comprobación previa: evita calcular el hash en el caso común de email repetido.
  if (await findUserByEmail(normalizedEmail)) {
    throw new ConflictError('El email ya está registrado');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  let user: User;
  try {
    user = await createUser(nombre.trim(), normalizedEmail, passwordHash);
  } catch (err) {
    // Dos registros simultáneos pueden pasar la comprobación previa;
    // la restricción UNIQUE de la base es la que decide.
    if (isUniqueViolation(err, EMAIL_UNIQUE_CONSTRAINT)) {
      throw new ConflictError('El email ya está registrado');
    }
    throw err;
  }

  return toPublicUser(user);
}
// Verifica credenciales y devuelve un JWT firmado. 
export async function login(
  email: string,
  password: string,
): Promise<{ token: string; user: PublicUser }> {
  const user = await findUserByEmail(email.trim().toLowerCase());
// bcrypt.compare se ejecuta siempre; sin usuario, se compara contra un hash falso.
  const valid = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);

  if (!user || !valid) {
    throw new AuthenticationError('Credenciales inválidas');
  }

  const token = jwt.sign({ sub: user.id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });

  return { token, user: toPublicUser(user) };
}