import { RequestHandler } from 'express';
import * as authService from '../services/auth.service';

//POST /auth/register 
export const register: RequestHandler = async (req, res) => {
  const { nombre, email, password } = req.body;
  const user = await authService.register(nombre, email, password);
  res.status(201).json({ user });
};

// POST /auth/login 
export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json(result);
};