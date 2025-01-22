import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { myDataSource } from './app-data-source';
import { authRouter } from './auth';
import { postRouter } from './post';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user_id?: number;
    }
  }
}

myDataSource
  .initialize()
  .then(() => {
    console.log('data source initialized');
  })
  .catch((err) => {
    console.error('Error during data source initialization', err);
  });

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(authRouter, postRouter);

const port = process.env.PORT || 5252;

app.listen(port, () => {
  console.log(`server working on ${port}`);
});
