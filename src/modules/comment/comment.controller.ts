import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { UserEntity } from '../user/user.entity';
import { User } from '../user/decorators/user.decorator';

import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Controller('articles/:slug/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

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
    return this.commentService.buildSingleCommentResponse(comment);
  }
}