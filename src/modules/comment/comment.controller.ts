import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { UserEntity } from '../user/user.entity';
import { User } from '../user/decorators/user.decorator';

import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Controller('articles/:slug/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  async getComments(@Param('slug') slug: string, @User() user: UserEntity) {
    const comments = await this.commentService.getCommentsForArticle(slug);
    return this.commentService.buildMultipleCommentsResponse(comments, user);
  }

  @Post()
  @UseGuards(AuthenticatedGuard)
  @UsePipes(new ValidationPipe())
  async createComment(
    @Param('slug') slug: string,
    @Body() createCommentDto: CreateCommentDto,
    @User() user: UserEntity,
  ) {
    const comment = await this.commentService.createComment(
      createCommentDto,
      slug,
      user,
    );
    return this.commentService.buildSingleCommentResponse(comment, user);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  async deleteComment(@Param('id') id: number, @User() user: UserEntity) {
    await this.commentService.deleteComment(id, user);
  }
}
