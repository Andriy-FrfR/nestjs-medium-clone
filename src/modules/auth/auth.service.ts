import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '../user/user.entity';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const [userWithGivenEmail, userWithGivenUsername] = await Promise.all([
      this.userRepository.findOneBy({
        email: registerDto.user.email,
      }),
      this.userRepository.findOneBy({ username: registerDto.user.username }),
    ]);

    if (userWithGivenEmail || userWithGivenUsername) {
      throw new HttpException(
        userWithGivenEmail
          ? 'User with given email already exists'
          : 'User with given username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.hashPassword(registerDto.user.password);

    const user = this.userRepository.create({
      email: registerDto.user.email,
      username: registerDto.user.username,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.user.email,
      },
      select: ['email', 'username', 'bio', 'image', 'password'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const passwordsMatch = await bcrypt.compare(
      loginDto.user.password,
      user.password,
    );

    if (!passwordsMatch) {
      throw new HttpException('Password is not valid', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  buildUserResponse(user: UserEntity) {
    const accessToken = jwt.sign(
      String(user.id),
      this.configService.get('JWT_SECRET'),
    );
    return {
      user: {
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
        token: accessToken,
      },
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  decodeToken(token: string) {
    return jwt.decode(token, this.configService.get('JWT_SECRET'));
  }
}
