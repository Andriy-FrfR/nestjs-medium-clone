import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TagModule } from '../tag/tag.module';

import { ArticleEntity } from './article.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), TagModule],
  exports: [ArticleService],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
