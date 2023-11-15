import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { User } from './decorators/user.decorator';
import { UserEntity } from './user.entity';
import { AuthService } from '../auth/auth.service';

@Controller()
export class UserController {
  constructor(private authService: AuthService) {}

  @Get('user')
  @UseGuards(AuthenticatedGuard)
  async getCurrentUser(@User() user: UserEntity) {
    return this.authService.buildUserResponse(user);
  }
}
