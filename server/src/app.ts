import express, { Request, Response } from 'express';

import authRoutes from './routes/auth';
import noteRoutes from './routes/notes';
import fileRoutes from './routes/files'

import connectDB from './database'
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

// Using sessions instead of JWT for client authentication
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 1 day in seconds
    // ttl: 30, // 30 seconds
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // must be false for localhost over HTTP
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
    // maxAge: 30 * 1000, // 30 seconds
  }
}));

app.use(express.json());


connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/files', fileRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express Server!');
})

app.listen(3000, () => {
  console.log('Server running on PORT 3000');
});