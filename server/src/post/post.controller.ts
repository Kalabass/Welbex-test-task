import { Request, Response } from 'express';
import { myDataSource } from '../app-data-source';
import { CreatePostDto } from './dto/create-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { Post } from './entities/post.entity';

class PostController {
  private readonly postRepository = myDataSource.getRepository(Post);

  ErrorHandler = (error: unknown, res: Response, message: string) => {
    console.error(error);
    res.status(500).json({
      message: message,
    });
  };

  formatDate = (date: Date): string => {
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const posts = await this.postRepository.find({
        relations: { user: true },
        order: { createdAt: 'DESC', updatedAt: 'DESC' },
      });

      const formattedPosts = posts.map((post) => ({
        id: post.id,
        message: post.message,
        date: this.formatDate(post.createdAt),
        user: post.user.login,
      }));

      res.status(200).json(formattedPosts);
    } catch (error) {
      this.ErrorHandler(error, res, 'Error during getting posts');
    }
  };

  create = async (req: Request<{}, {}, CreatePostDto>, res: Response) => {
    try {
      const { message } = req.body;

      const user_id = req.user_id;

      if (!user_id) {
        res.status(400).json({ message: 'something went wrong' });
      }

      await this.postRepository.save({ message, user: { id: user_id } });

      res.status(201).json({ message: 'Created successfully' });
    } catch (error) {
      this.ErrorHandler(error, res, 'Error during creating post');
    }
  };

  update = async (
    req: Request<{ id: string }, {}, UpdatePostDto>,
    res: Response
  ) => {
    try {
      const { message } = req.body;
      const postId = Number(req.params.id);

      const user_id = req.user_id;
      if (!user_id) {
        res.status(400).json({ message: 'something went wrong' });
        return;
      }

      const post = await this.postRepository.findOne({
        where: { id: postId },
        relations: { user: true },
      });

      if (!post) {
        res.status(404).json({ message: `No post to update` });
        return;
      }

      if (!post.user || !(post.user.id === user_id)) {
        res.status(403).json({ message: `You can't edit this post ` });
        return;
      }

      await this.postRepository.update(post.id, { message: message });

      res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
      this.ErrorHandler(error, res, 'Error during updating post');
    }
  };
}

export const postController = new PostController();
