import { Router } from 'express';
import { handleValidationErrors } from '../middleware/handleValidationErrors.middleware';
import { authController } from './auth.controller';
import { validateAuth } from './validators/auth.validators';

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication.
 */

/**
 * @swagger
 * /auth/reg:
 *   post:
 *     summary: Register a new user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: User's login.
 *               password:
 *                 type: string
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: Successful registration. Returns access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successful registration
 *                 access_token:
 *                   type: string
 *                   description: JWT access token.
 *       400:
 *         description: Registration failed due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                 errorCode:
 *                   type: string
 *                   description: Error code.
 *       500:
 *         description: Internal server error.
 */
authRouter.post(
  '/auth/reg',
  validateAuth,
  handleValidationErrors,
  authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: User's login.
 *               password:
 *                 type: string
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: Successful login. Returns access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success login
 *                 access_token:
 *                   type: string
 *                   description: JWT access token.
 *       400:
 *         description: Login failed due to invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                 errorCode:
 *                   type: string
 *                   description: Error code.
 *       500:
 *         description: Internal server error.
 */
authRouter.post(
  '/auth/login',
  validateAuth,
  handleValidationErrors,
  authController.login
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully. Returns new access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tokens refreshed successfully
 *                 access_token:
 *                   type: string
 *                   description: New JWT access token.
 *       401:
 *         description: Unauthorized due to missing or invalid refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Internal server error.
 */
authRouter.post('/auth/refresh', authController.refreshTokens);

export { authRouter };
