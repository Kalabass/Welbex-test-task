import { Router } from 'express';
import { jwtValidate } from '../middleware/jwtValidation.middleware';
import { postController } from './post.controller';

const postRouter = Router();

postRouter.get('/posts', postController.getAll);
postRouter.post('/posts', jwtValidate, postController.create);
postRouter.patch('/posts/:id', jwtValidate, postController.update);

export { postRouter };
