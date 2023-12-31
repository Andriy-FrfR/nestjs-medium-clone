import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller()
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('user')
  @UseGuards(AuthenticatedGuard)
  async getCurrentUser(@User() user: UserEntity) {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'Forbidden',
    schema: {
      example: {
        user: {
          email: 'string',
          bio: 'string',
          image: 'string',
          username: 'XXXXXX',
        },
      },
    },
  })
  @UseGuards(AuthenticatedGuard)
  @UsePipes(new ValidationPipe())
  async updateUser(
    @User() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateUser(user, updateUserDto);
    return this.userService.buildUserResponse(updatedUser);
  }

  @Get('profiles/:username')
  async getProfile(
    @Param('username') username: string,
    @User() currentUser?: UserEntity,
  ) {
    const user = await this.userService.getUserWithFollowedUsers(username);
    return this.userService.buildProfileResponse(user, currentUser);
  }

  @Post('profiles/:username/follow')
  @UseGuards(AuthenticatedGuard)
  async createFollow(
    @Param('username') userToFollowUsername: string,
    @User() currentUser: UserEntity,
  ) {
    const followedUser = await this.userService.createFollow(
      userToFollowUsername,
      currentUser,
    );
    return this.userService.buildProfileResponse(followedUser, currentUser);
  }

  @Delete('profiles/:username/follow')
  @UseGuards(AuthenticatedGuard)
  async deleteFollow(
    @Param('username') userToUnfollowUsername: string,
    @User() currentUser: UserEntity,
  ) {
    const followedUser = await this.userService.deleteFollow(
      userToUnfollowUsername,
      currentUser,
    );
    return this.userService.buildProfileResponse(followedUser, currentUser);
  }
}
