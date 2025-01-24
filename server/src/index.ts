import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { authRouter } from './auth';
import { myDataSource } from './config/app-data-source';
import { specs } from './config/swagger-config';
import { postRouter } from './post';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user_id?: number;
    }
  }
}

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/uploads', express.static('uploads'));

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

myDataSource
  .initialize()
  .then(() => {
    console.log('data source initialized');
    app.listen(port, () => {
      console.log(`server working on ${port}`);
      console.log(
        `Swagger documentation available at http://localhost:${port}/api-docs`
      );
    });
  })
  .catch((err) => {
    console.error('Error during data source initialization', err);
  });
