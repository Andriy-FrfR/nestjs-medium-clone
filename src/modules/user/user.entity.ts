import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ArticleEntity } from '../article/article.entity';
import { CommentEntity } from '../comment/comment.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  bio: string;

  @OneToMany(() => ArticleEntity, (articles) => articles.author)
  articles: ArticleEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];
}
