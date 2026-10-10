declare global {
  namespace Express {
    interface Request {
      //Id del usuario autenticado, puesto por el middleware authenticate. 
      userId?: string;
    }
  }
}

export {};