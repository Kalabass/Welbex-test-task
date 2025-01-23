import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../post';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  type: string;

  @ManyToOne(() => Post, (post) => post.media, { onDelete: 'CASCADE' })
  post: Post;
}
