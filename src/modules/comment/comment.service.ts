import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../user/user.entity';
import { ArticleService } from '../article/article.service';

import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    private articleService: ArticleService,
  ) {}

  async getCommentsForArticle(slug: string): Promise<CommentEntity[]> {
    const article = await this.articleService.getArticleBySlug(slug);
    return this.commentRepository.find({
      where: { article: { slug: article.slug } },
      relations: ['author'],
    });
  }

  async createComment(
    createCommentDto: CreateCommentDto,
    slug: string,
    user: UserEntity,
  ): Promise<CommentEntity> {
    const article = await this.articleService.getArticleBySlug(slug);
    const comment = Object.assign(new CommentEntity(), {
      article,
      author: user,
      body: createCommentDto.comment.body,
    });
    return this.commentRepository.save(comment);
  }

  buildSingleCommentResponse(comment: CommentEntity) {
    return {
      comment: {
        body: comment.body,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: {
          username: comment.author.username,
          bio: comment.author.bio,
          image: comment.author.image,
        },
      },
    };
  }

  buildMultipleCommentsResponse(comments: CommentEntity[]) {
    return {
      comments: comments.map((comment) => ({
        body: comment.body,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: {
          username: comment.author.username,
          bio: comment.author.bio,
          image: comment.author.image,
        },
      })),
    };
  }
}
