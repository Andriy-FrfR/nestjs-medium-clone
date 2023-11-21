import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { CommentEntity } from '../comment/comment.entity';
import { TagEntity } from '../tag/tag.entity';

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  author: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.article)
  comments: CommentEntity[];

  @ManyToMany(() => TagEntity, (tag) => tag.articles)
  @JoinTable({
    joinColumn: { name: 'articleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: TagEntity[];

  @ManyToMany(() => UserEntity, (user) => user.favoritedArticles)
  @JoinTable()
  favoritedBy: UserEntity[];
}
