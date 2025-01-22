import { Router } from 'express';
import { handleValidationErrors } from '../middleware/handleValidationErrors.middleware';
import { authController } from './auth.controller';
import { validateAuth } from './validators/auth.validators';

const authRouter = Router();

authRouter.post(
  '/auth/reg',
  validateAuth,
  handleValidationErrors,
  authController.register
);
authRouter.post(
  '/auth/login',
  validateAuth,
  handleValidationErrors,
  authController.login
);
authRouter.post('/auth/refresh', authController.refreshTokens);

export { authRouter };
