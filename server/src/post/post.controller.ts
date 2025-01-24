import { Request, Response } from 'express';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { myDataSource } from '../config/app-data-source';
import { Media } from '../media';
import { CreatePostDto } from './dto/create-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { Post } from './entities/post.entity';

const generateFileName = (originalName: string): string => {
  const ext = path.extname(originalName);
  return `${Date.now()}-${uuidv4()}${ext}`;
};

const getMediaType = (mimetype: string): 'image' | 'video' => {
  return mimetype.startsWith('image') ? 'image' : 'video';
};

const getUploadFolder = (mediaType: 'image' | 'video'): string => {
  return path.join('uploads', `${mediaType}s`);
};

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/ogg',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const deleteMediaFiles = (mediaFiles: Media[]) => {
  for (const media of mediaFiles) {
    const filePath = path.join(__dirname, '../..', media.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

const formatDate = (date: Date): string => {
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const mediaType = getMediaType(file.mimetype);
    cb(null, getUploadFolder(mediaType));
  },
  filename: (_req, file, cb) => {
    cb(null, generateFileName(file.originalname));
  },
});

const upload = multer({ storage, fileFilter }).array('media', 10);

class PostController {
  private readonly postRepository = myDataSource.getRepository(Post);
  private readonly mediaRepository = myDataSource.getRepository(Media);

  private ErrorHandler(
    error: unknown,
    res: Response,
    message: string
  ): Response {
    console.error(error);
    return res.status(500).json({ message });
  }

  getAll = async (_req: Request, res: Response) => {
    try {
      const posts = await this.postRepository.find({
        relations: { user: true, media: true },
        order: { createdAt: 'DESC', updatedAt: 'DESC' },
      });

      const formattedPosts = posts.map((post) => ({
        id: post.id,
        message: post.message,
        date: formatDate(post.createdAt),
        user: { id: post.user.id, login: post.user.login },
        media: post.media,
      }));

      res.status(200).json(formattedPosts);
    } catch (error) {
      this.ErrorHandler(error, res, 'Error during getting posts');
    }
  };

  create = async (req: Request<{}, {}, CreatePostDto>, res: Response) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: 'Error during files upload' });
      }

      try {
        const { message } = req.body;
        const user_id = req.user_id;

        if (!user_id) {
          return res.status(401).json({ message: 'Authentication error' });
        }

        const post = this.postRepository.create({
          message,
          user: { id: user_id },
        });
        await this.postRepository.save(post);

        if (req.files && Array.isArray(req.files)) {
          const mediaFiles = req.files.map((file) => ({
            url: `/uploads/${getMediaType(file.mimetype)}s/${file.filename}`,
            type: getMediaType(file.mimetype),
            post,
          }));
          await this.mediaRepository.save(mediaFiles);
        }

        res.status(201).json({ message: 'Post created successfully' });
      } catch (error) {
        this.ErrorHandler(error, res, 'Error during creating post');
      }
    });
  };

  update = async (
    req: Request<{ id: string }, {}, UpdatePostDto>,
    res: Response
  ) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: 'Error during files upload' });
      }

      try {
        const { message, deletedMediaIds } = req.body;
        const deletedMediaIdsParsed = JSON.parse(
          deletedMediaIds || '[]'
        ) as number[];
        const user_id = req.user_id;
        const postId = parseInt(req.params.id);

        if (!user_id) {
          return res.status(401).json({ message: 'Authentication error' });
        }

        const post = await this.postRepository.findOne({
          where: { id: postId },
          relations: { media: true },
        });

        if (!post) {
          return res.status(404).json({ message: 'No post to update' });
        }

        if (deletedMediaIdsParsed.length > 0) {
          await this.deleteMedia(deletedMediaIdsParsed, post);
        }

        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
          const mediaFiles = (req.files as Express.Multer.File[]).map(
            (file) => ({
              url: `/uploads/${getMediaType(file.mimetype)}s/${file.filename}`,
              type: getMediaType(file.mimetype),
              post,
            })
          );
          const newMedia = await this.mediaRepository.save(mediaFiles);
          post.media = [...post.media, ...newMedia];
        }

        post.message = message;
        await this.postRepository.save(post);

        res.status(200).json({ message: 'Post updated successfully' });
      } catch (error) {
        this.ErrorHandler(error, res, 'Error during updating post');
      }
    });
  };

  private async deleteMedia(deletedMediaIds: number[], post: Post) {
    for (const id of deletedMediaIds) {
      const mediaToDelete = await this.mediaRepository.findOne({
        where: { id },
      });
      if (mediaToDelete) {
        const filePath = path.join(
          __dirname,
          '../..',
          'uploads',
          getMediaType(mediaToDelete.type) + 's',
          path.basename(mediaToDelete.url)
        );

        fs.unlink(filePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error(`Error during deleting file: ${filePath}`);
          }
        });

        await this.mediaRepository.delete(id);
        post.media = post.media.filter((media) => media.id !== id);
      }
    }
  }

  delete = async (req: Request<{ id: string }>, res: Response) => {
    try {
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
        res.status(404).json({ message: `No post to delete` });
        return;
      }

      if (!post.user || post.user.id !== user_id) {
        res.status(403).json({ message: `You can't delete this post` });
        return;
      }

      const mediaFiles = await this.mediaRepository.find({
        where: { post: { id: postId } },
      });

      await deleteMediaFiles(mediaFiles);

      await this.mediaRepository.delete({ post: { id: postId } });

      await this.postRepository.delete(post.id);

      res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      this.ErrorHandler(error, res, 'Error during deleting post');
    }
  };
}

export const postController = new PostController();
