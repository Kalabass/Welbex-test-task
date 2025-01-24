import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { myDataSource } from '../config/app-data-source';
import { User } from '../user';
import { AuthDTO } from './dto/auth-dto';

interface CustomRequest extends Request {
  cookies: {
    refresh_token: string;
  };
}

dotenv.config();

class AuthController {
  ErrorHandler = (error: unknown, res: Response, message: string) => {
    console.error(error);
    res.status(500).json({
      message: message,
    });
  };

  private async generateTokens(payload: any) {
    try {
      const { exp, iat, ...restPayload } = payload;

      const newPayload = {
        ...restPayload,
        iat: Math.floor(Date.now() / 1000),
      };

      const newAccessToken = jwt.sign(
        newPayload,
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: '10m',
        }
      );

      const newRefreshToken = jwt.sign(
        newPayload,
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: '7d',
        }
      );

      return {
        newAccessToken,
        newRefreshToken,
      };
    } catch (error) {
      console.error(error);
    }
  }

  private readonly userRepository = myDataSource.getRepository(User);

  login = async (req: Request<{}, {}, AuthDTO>, res: Response) => {
    try {
      const { login, password } = req.body;

      const user = await this.userRepository.findOne({
        where: { login: login },
      });

      if (!user) {
        res
          .status(400)
          .json({ message: 'Неправильный логин', errorCode: 'INVALID_LOGIN' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(400).json({
          message: 'Неправильный пароль',
          errorCode: 'INVALID_PASSWORD',
        });
        return;
      }

      const payload = { id: user.id, login: user.login };

      const { newAccessToken, newRefreshToken } = await this.generateTokens(
        payload
      );

      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'none',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      res
        .status(200)
        .json({ message: 'Success login', access_token: newAccessToken });
    } catch (error) {
      this.ErrorHandler(error, res, 'Error during login');
    }
  };

  register = async (req: Request<{}, {}, AuthDTO>, res: Response) => {
    try {
      const { login, password } = req.body;

      const isExist = await this.userRepository.findOne({
        where: { login },
      });

      if (isExist) {
        res.status(400).json({
          message: 'Логин занят',
          errorCode: 'INVALID_LOGIN',
        });
        return;
      }

      const hashPassword = await bcrypt.hash(password, 5);

      const user = await this.userRepository.save({
        login: login,
        password: hashPassword,
      });

      const payload = { id: user.id, login: user.login };

      const { newAccessToken, newRefreshToken } = await this.generateTokens(
        payload
      );

      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'none',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      res.status(200).json({
        message: 'Successful registration',
        access_token: newAccessToken,
      });
    } catch (error) {
      this.ErrorHandler(error, res, 'Error during registration');
    }
  };

  refreshTokens = async (req: Request<CustomRequest>, res: Response) => {
    try {
      const refresh_token = req.cookies.refresh_token;

      if (!refresh_token) {
        res.status(401).json({ message: 'Token is missing' });
        return;
      }

      let payload;

      try {
        payload = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
      } catch (error) {
        console.error('Error during verifying refresh token', error);
        res.status(401).json({ message: 'invalid refresh token' });
        return;
      }

      if (!payload) {
        res.status(401).json({ message: 'invalid payload' });
        return;
      }

      const { newAccessToken, newRefreshToken } = await this.generateTokens(
        payload
      );

      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'none',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      res.status(200).json({
        message: 'Tokens refreshed  successfully',
        access_token: newAccessToken,
      });
    } catch (error) {
      this.ErrorHandler(error, res, 'Error during refreshing tokens');
    }
  };
}

export const authController = new AuthController();
