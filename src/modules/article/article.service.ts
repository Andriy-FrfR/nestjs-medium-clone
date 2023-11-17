import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../user/user.entity';

import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dtos/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    createArticleDto: CreateArticleDto,
    user: UserEntity,
  ): Promise<ArticleEntity> {
    const slug = this.generateSlug(createArticleDto.article.title);
    const article = this.articleRepository.create({
      ...createArticleDto.article,
      author: user,
      slug,
    });

    return await this.articleRepository.save(article);
  }

  private generateSlug(string: string): string {
    return (
      string
        .toLowerCase()
        .split(' ')
        .filter((value) => Boolean(value))
        .join('-') + `-${String(Date.now()).slice(-6)}`
    );
  }

  async getArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author'],
    });

    if (!article)
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);

    return article;
  }

  buildArticleResponse(article: ArticleEntity) {
    return {
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        author: {
          username: article.author.username,
          bio: article.author.bio,
          image: article.author.image,
        },
      },
    };
  }
}
