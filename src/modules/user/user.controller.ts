import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('user')
  @UseGuards(AuthenticatedGuard)
  async getCurrentUser(@User() user: UserEntity) {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthenticatedGuard)
  @UsePipes(new ValidationPipe())
  async updateUser(
    @User() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateUser(user, updateUserDto);
    return this.userService.buildUserResponse(updatedUser);
  }
}
