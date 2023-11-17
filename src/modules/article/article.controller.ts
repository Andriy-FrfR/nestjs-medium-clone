import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';

import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { CreateArticleDto } from './dtos/create-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get(':slug')
  async getArticle(@Param('slug') slug: string) {
    const article = await this.articleService.getArticleBySlug(slug);
    return this.articleService.buildArticleResponse(article);
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
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthenticatedGuard)
  async deleteArticle(@Param('slug') slug: string, @User() user: UserEntity) {
    await this.articleService.deleteArticle(slug, user);
  }
}
