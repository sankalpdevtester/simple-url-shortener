import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Invalid token' });
  }
};

export default authMiddleware;