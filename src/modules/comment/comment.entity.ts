import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArticleEntity } from '../article/article.entity';
import { UserEntity } from '../user/user.entity';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ArticleEntity, (article) => article.comments)
  article: ArticleEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  author: UserEntity;
}
