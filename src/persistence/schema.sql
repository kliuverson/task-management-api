CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  fecha_vencimiento TIMESTAMPTZ,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'en curso', 'completada')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);