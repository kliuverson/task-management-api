import { NotFoundError } from '../errors/AppError';
import * as taskRepository from '../persistence/task.repository';
import { Task, TaskInput, TaskUpdate } from '../persistence/task.repository';

/** Crea una tarea para el usuario autenticado. */
export function createTask(userId: string, input: TaskInput): Promise<Task> {
  return taskRepository.createTask(userId, input);
}

/** Lista las tareas del usuario. */
export function listTasks(userId: string): Promise<Task[]> {
  return taskRepository.findTasksByUser(userId);
}

/** Devuelve una tarea del usuario o lanza NotFoundError. */
export async function getTask(id: string, userId: string): Promise<Task> {
  const task = await taskRepository.findTaskById(id, userId);
  if (!task) throw new NotFoundError('Tarea no encontrada');
  return task;
}

/** Actualiza parcialmente una tarea del usuario o lanza NotFoundError. */
export async function updateTask(
  id: string,
  userId: string,
  changes: TaskUpdate,
): Promise<Task> {
  const task = await taskRepository.updateTask(id, userId, changes);
  if (!task) throw new NotFoundError('Tarea no encontrada');
  return task;
}

/** Elimina una tarea del usuario o lanza NotFoundError. */
export async function deleteTask(id: string, userId: string): Promise<void> {
  const deleted = await taskRepository.deleteTask(id, userId);
  if (!deleted) throw new NotFoundError('Tarea no encontrada');
}