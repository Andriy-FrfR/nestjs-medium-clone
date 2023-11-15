import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
