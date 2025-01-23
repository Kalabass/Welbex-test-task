import { Router } from 'express';
import { jwtValidate } from '../middleware/jwtValidation.middleware';
import { postController } from './post.controller';

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API endpoints for managing blog posts.
 */

const postRouter = Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve all posts.
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: A list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error.
 */
postRouter.get('/posts', postController.getAll);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post.
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Post message.
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: Array of media files (images or videos).
 *     responses:
 *       201:
 *         description: Post created successfully.
 *       400:
 *         description: Bad Request. Error uploading files.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 *     security:
 *       - bearerAuth: []
 */
postRouter.post('/posts', jwtValidate, postController.create);

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Update an existing post.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Updated post message.
 *               deletedMediaIds:
 *                 type: string
 *                 description: JSON array of media IDs to delete.
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: Array of media files to add.
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *       400:
 *         description: Bad Request. Error uploading files.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 *     security:
 *       - bearerAuth: []
 */
postRouter.patch('/posts/:id', jwtValidate, postController.update);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. You do not have permission to delete this post.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 *     security:
 *       - bearerAuth: []
 */
postRouter.delete('/posts/:id', jwtValidate, postController.delete);

export { postRouter };
