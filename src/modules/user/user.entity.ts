import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @ManyToMany(() => UserEntity, (user) => user.followedBy)
  @JoinTable({
    joinColumn: { name: 'followingUserId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'followedUserId', referencedColumnName: 'id' },
  })
  following: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.following)
  followedBy: UserEntity[];
}
