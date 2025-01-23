import { Media } from './Media';
import { User } from './user';

export interface Post {
  id: number;
  message: string;
  date: string;
  user: User;
  media: Media[];
}

export interface PostCreateData extends Pick<Post, 'message'> {}
export interface PostUpdateData extends Partial<PostCreateData> {}
