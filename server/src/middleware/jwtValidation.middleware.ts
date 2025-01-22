import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

dotenv.config();

export const jwtValidate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res
      .status(401)
      .json({ message: 'Authorization token is missing or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    ) as JwtPayload;

    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
      req.user_id = decoded.id;
    } else {
      res.status(401).json({ message: 'Authorization token is invalid' });
      return;
    }
  } catch (error) {
    res.status(401).json({ message: 'Authorization token is invalid' });
    return;
  }

  next();
};
