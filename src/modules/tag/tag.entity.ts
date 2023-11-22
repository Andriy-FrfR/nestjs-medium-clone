import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ArticleEntity } from '../article/article.entity';

@Entity('tags')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => ArticleEntity, (article) => article.tags)
  articles: ArticleEntity[];
}
