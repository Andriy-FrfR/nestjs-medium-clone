import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { TagService } from '../tag/tag.service';

import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
    private tagService: TagService,
  ) {}

  async listArticles(params: {
    limit?: number;
    offset?: number;
    favorited?: string;
    author?: string;
    tag?: string;
  }): Promise<ArticleEntity[]> {
    const articles = await this.articleRepository.find({
      where: {
        author: { username: params.author },
        favoritedBy: { username: params.favorited },
        tags: { name: params.tag },
      },
      relations: ['tags', 'author', 'author.followedBy', 'favoritedBy'],
      take: params.limit,
      skip: params.offset,
      order: { createdAt: 'DESC' },
    });

    return articles;
  }

  async getUserFeed(
    currentUser: UserEntity,
    params: { limit?: number; offset?: number },
  ): Promise<ArticleEntity[]> {
    const following = currentUser.following;
    const followingIds = following.map((user) => user.id);
    const articles = await this.articleRepository.find({
      where: { author: { id: In(followingIds) } },
      order: { createdAt: 'DESC' },
      skip: params.offset,
      take: params.limit,
      relations: ['tags', 'author', 'author.followedBy', 'favoritedBy'],
    });
    return articles;
  }

  async getArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['tags', 'author', 'author.followedBy', 'favoritedBy'],
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
    const tags = createArticleDto.article.tagList
      ? await this.tagService.upsertTags(createArticleDto.article.tagList)
      : [];

    const article = this.articleRepository.create({
      ...createArticleDto.article,
      author: user,
      tags,
      slug,
    });

    await this.articleRepository.save(article);

    return this.getArticleBySlug(slug);
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

    if (filteredInput.tagList) {
      filteredInput.tags = await this.tagService.upsertTags(
        filteredInput.tagList,
      );
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

  async favoriteArticle(
    slug: string,
    currentUser: UserEntity,
  ): Promise<ArticleEntity> {
    const article = await this.getArticleBySlug(slug);

    if (article.favoritedBy.find((user) => user.id === currentUser.id)) {
      throw new HttpException('Already favorited', HttpStatus.BAD_REQUEST);
    }

    article.favoritedBy.push(currentUser);

    return this.articleRepository.save(article);
  }

  async unfavoriteArticle(
    slug: string,
    currentUser: UserEntity,
  ): Promise<ArticleEntity> {
    const article = await this.getArticleBySlug(slug);

    if (!article.favoritedBy.find((user) => user.id === currentUser.id)) {
      throw new HttpException('Already unfavorited', HttpStatus.BAD_REQUEST);
    }

    article.favoritedBy = article.favoritedBy.filter(
      (user) => user.id !== currentUser.id,
    );

    return this.articleRepository.save(article);
  }

  buildSingleArticleResponse(article: ArticleEntity, currentUser?: UserEntity) {
    return {
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited: Boolean(
          article.favoritedBy.find((user) => user.id === currentUser?.id),
        ),
        favoritesCount: article.favoritedBy.length,
        tagList: article.tags.map((tag) => tag.name),
        author: {
          username: article.author.username,
          bio: article.author.bio,
          image: article.author.image,
          following: Boolean(
            article.author.followedBy.find(
              (user) => user.id === currentUser?.id,
            ),
          ),
        },
      },
    };
  }

  buildMultipleArticlesResponse(
    articles: ArticleEntity[],
    currentUser?: UserEntity,
  ) {
    return articles.map((article) => ({
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited: Boolean(
          article.favoritedBy.find((user) => user.id === currentUser?.id),
        ),
        favoritesCount: article.favoritedBy.length,
        tagList: article.tags.map((tag) => tag.name),
        author: {
          username: article.author.username,
          bio: article.author.bio,
          image: article.author.image,
          following: Boolean(
            article.author.followedBy.find(
              (user) => user.id === currentUser?.id,
            ),
          ),
        },
      },
    }));
  }
}
