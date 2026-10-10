import { pool } from './db';

export type TaskStatus = 'pendiente' | 'en curso' | 'completada';

export interface Task {
  id: string;
  user_id: string;
  titulo: string;
  descripcion: string | null;
  fecha_vencimiento: Date | null;
  estado: TaskStatus;
  created_at: Date;
}

export interface TaskInput {
  titulo: string;
  descripcion?: string | null;
  fecha_vencimiento?: string | null;
  estado?: TaskStatus;
}
export type TaskUpdate = Partial<TaskInput>;
 
//Crea una tarea asociada al usuario autenticado. 
export async function createTask(userId: string, input: TaskInput): Promise<Task> {
  const { rows } = await pool.query<Task>(
    `INSERT INTO tasks (user_id, titulo, descripcion, fecha_vencimiento, estado)
     VALUES ($1, $2, $3, $4, COALESCE($5, 'pendiente'))
     RETURNING *`,
    [
      userId,
      input.titulo,
      input.descripcion ?? null,
      input.fecha_vencimiento ?? null,
      input.estado ?? null,
    ],
  );
  return rows[0];
}

//Lista solo las tareas del usuario. 
export async function findTasksByUser(userId: string): Promise<Task[]> {
  const { rows } = await pool.query<Task>(
    'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
    [userId],
  );
  return rows;
}

// Busca una tarea por id, solo si pertenece al usuario. 
export async function findTaskById(id: string, userId: string): Promise<Task | null> {
  const { rows } = await pool.query<Task>(
    'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
    [id, userId],
  );
  return rows[0] ?? null;
}

// Elimina una tarea del usuario; devuelve false si no existe o no es suya. 
export async function deleteTask(id: string, userId: string): Promise<boolean> {
  const result = await pool.query(
    'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
    [id, userId],
  );
  return (result.rowCount ?? 0) > 0;
}

// Campos que se pueden actualizar mediante PATCH.
const UPDATABLE_FIELDS = ['titulo', 'descripcion', 'fecha_vencimiento', 'estado'] as const;

 //Actualiza solo los campos recibidos (undefined = no tocar).
 //Devuelve null si la tarea no existe o no pertenece al usuario.

export async function updateTask(
  id: string,
  userId: string,
  changes: TaskUpdate,
): Promise<Task | null> {
  const sets: string[] = [];
  const values: unknown[] = [];

  for (const field of UPDATABLE_FIELDS) {
    if (changes[field] !== undefined) {
      values.push(changes[field]);
      sets.push(`${field} = $${values.length}`);
    }
  }

  if (sets.length === 0) {
    return findTaskById(id, userId);
  }

  values.push(id, userId);
  const { rows } = await pool.query<Task>(
    `UPDATE tasks SET ${sets.join(', ')}
     WHERE id = $${values.length - 1} AND user_id = $${values.length}
     RETURNING *`,
    values,
  );
  return rows[0] ?? null;
}