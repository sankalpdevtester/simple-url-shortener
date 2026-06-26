import express, { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.validateUser(email, password);
  if (!user) return res.status(401).send({ message: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY!, { expiresIn: '1h' });
  res.send({ token });
});

router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.createUser(email, hashedPassword, name);
  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY!, { expiresIn: '1h' });
  res.send({ token });
});

router.get('/me', async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: 'Unauthorized' });
  const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { userId: number };
  const user = await User.findByPk(decoded.userId);
  if (!user) return res.status(404).send({ message: 'User not found' });
  res.send(user);
});

export default router;