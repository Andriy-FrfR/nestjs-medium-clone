import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../user/user.entity';

import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
  ) {}

  async getArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author'],
    });

    if (!article)
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);

    return article;
  }

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

  async updateArticle(
    slug: string,
    updateArticleDto: UpdateArticleDto,
    user: UserEntity,
  ): Promise<ArticleEntity> {
    const article = await this.getArticleBySlug(slug);

    if (article.author.id !== user.id)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    const filteredInput = Object.fromEntries(
      Object.entries(updateArticleDto.article).filter(([, value]) =>
        Boolean(value),
      ),
    );

    if (filteredInput.title && filteredInput.title !== article.title) {
      filteredInput.slug = this.generateSlug(filteredInput.title);
    }

    Object.assign(article, filteredInput);

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

  async deleteArticle(slug: string, user: UserEntity) {
    const article = await this.getArticleBySlug(slug);

    if (article.author.id !== user.id)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    await this.articleRepository.delete(article);
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
