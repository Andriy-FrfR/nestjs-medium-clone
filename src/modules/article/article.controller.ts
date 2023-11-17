import {
  Body,
  Controller,
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

@Controller()
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Post('articles')
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
}
