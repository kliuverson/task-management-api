import dotenv from 'dotenv';
dotenv.config();

// Carga y valida las variables de entorno una sola vez (Singleton). 
class Config {
  private static instance: Config;

  readonly port: number;
  readonly nodeEnv: string;
  readonly jwtSecret: string;
  readonly jwtExpiresIn: string;
  readonly db: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };

  private constructor() {
    this.port = Number(process.env.PORT ?? 3000);
    this.nodeEnv = process.env.NODE_ENV ?? 'development';
    this.jwtSecret = Config.required('JWT_SECRET');
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? '1h';
    this.db = {
      host: Config.required('DB_HOST'),
      port: Number(process.env.DB_PORT ?? 5432),
      user: Config.required('DB_USER'),
      password: Config.required('DB_PASSWORD'),
      database: Config.required('DB_NAME'),
    };
  }

  static getInstance(): Config {
    if (!Config.instance) Config.instance = new Config();
    return Config.instance;
  }

  private static required(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Falta la variable de entorno: ${name}`);
    return value;
  }
}

export const config = Config.getInstance();