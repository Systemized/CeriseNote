import express, { Request, Response } from 'express';
import connectDB from './database'
import authRoutes from './routes/auth';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express Server!');
})

app.listen(3000, () => {
  console.log('Server running on PORT 3000');
});