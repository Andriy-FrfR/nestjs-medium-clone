import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { ValidationPipe } from 'src/pipes/validation.pipe';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get()
  async listArticles(
    @Query()
    params: {
      limit?: number;
      offset?: number;
      favorited?: string;
      author?: string;
      tag?: string;
    },
    @User() currentUser: UserEntity,
  ) {
    const articles = await this.articleService.listArticles(params);
    return this.articleService.buildMultipleArticlesResponse(
      articles,
      currentUser,
    );
  }

  @Get('feed')
  @UseGuards(AuthenticatedGuard)
  async getUserFeed(
    @Query()
    params: {
      limit?: number;
      offset?: number;
    },
    @User() currentUser: UserEntity,
  ) {
    const articles = await this.articleService.getUserFeed(currentUser, params);
    return this.articleService.buildMultipleArticlesResponse(
      articles,
      currentUser,
    );
  }

  @Get(':slug')
  async getArticle(@Param('slug') slug: string, @User() user: UserEntity) {
    const article = await this.articleService.getArticleBySlug(slug);
    return this.articleService.buildSingleArticleResponse(article, user);
  }

  @Post()
  @UseGuards(AuthenticatedGuard)
  @UsePipes(new ValidationPipe())
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @User() user: UserEntity,
  ) {
    const article = await this.articleService.createArticle(
      createArticleDto,
      user,
    );
    return this.articleService.buildSingleArticleResponse(article, user);
  }

  @Put(':slug')
  @UseGuards(AuthenticatedGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(
    @Param('slug') slug: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @User() user: UserEntity,
  ) {
    const article = await this.articleService.updateArticle(
      slug,
      updateArticleDto,
      user,
    );
    return this.articleService.buildSingleArticleResponse(article, user);
  }

  @Delete(':slug')
  @UseGuards(AuthenticatedGuard)
  async deleteArticle(@Param('slug') slug: string, @User() user: UserEntity) {
    await this.articleService.deleteArticle(slug, user);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthenticatedGuard)
  async favoriteArticle(@Param('slug') slug: string, @User() user: UserEntity) {
    const article = await this.articleService.favoriteArticle(slug, user);
    return this.articleService.buildSingleArticleResponse(article, user);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthenticatedGuard)
  async unfavoriteArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ) {
    const article = await this.articleService.unfavoriteArticle(slug, user);
    return this.articleService.buildSingleArticleResponse(article, user);
  }
}
