import { RequestHandler } from 'express';
import * as taskService from '../services/task.service';

/** POST /tasks */
export const create: RequestHandler = async (req, res) => {
  const task = await taskService.createTask(req.userId!, req.body);
  res.status(201).json({ task });
};

/** GET /tasks */
export const list: RequestHandler = async (req, res) => {
  const tasks = await taskService.listTasks(req.userId!);
  res.json({ tasks });
};

/** GET /tasks/:id */
export const getOne: RequestHandler = async (req, res) => {
  const task = await taskService.getTask(String(req.params.id), req.userId!);
  res.json({ task });
};

/** PUT /tasks/:id */
export const update: RequestHandler = async (req, res) => {
  const task = await taskService.updateTask(String(req.params.id), req.userId!, req.body);
  res.json({ task });
};

/** DELETE /tasks/:id */
export const remove: RequestHandler = async (req, res) => {
  await taskService.deleteTask(String(req.params.id), req.userId!);
  res.status(204).send();
};