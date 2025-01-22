import { body } from 'express-validator';

export const validateAuth = [
  body('login')
    .isLength({ min: 4, max: 15 })
    .withMessage('Login should contain from 4 to 15 letters'),
  body('password')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password should contain from 6 to 20 letters'),
];
