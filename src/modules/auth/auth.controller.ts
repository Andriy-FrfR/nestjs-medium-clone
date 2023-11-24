import { Body, Controller, Post, UsePipes } from '@nestjs/common';

import { ValidationPipe } from '../../pipes/validation.pipe';

import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return this.authService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.login(loginDto);
    return this.authService.buildUserResponse(user);
  }
}
