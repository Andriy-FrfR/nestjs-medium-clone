import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthService } from '../auth/auth.service';

import { UserEntity } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async updateUser(
    user: UserEntity,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const filteredInput = Object.fromEntries(
      Object.entries(updateUserDto.user).filter(([, value]) => value !== null),
    );

    if (filteredInput.email && filteredInput.email !== user.email) {
      const userWithGivenEmail = await this.userRepository.findOneBy({
        email: filteredInput.email,
      });

      if (userWithGivenEmail) {
        throw new HttpException(
          'User with given email already exists',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (filteredInput.username && filteredInput.username !== user.username) {
      const userWithGivenUsername = await this.userRepository.findOneBy({
        username: filteredInput.username,
      });

      if (userWithGivenUsername) {
        throw new HttpException(
          'User with given username already exists',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (filteredInput.password) {
      filteredInput.password = await this.authService.hashPassword(
        filteredInput.password,
      );
    }

    Object.assign(user, filteredInput);
    await this.userRepository.save(user);

    return user;
  }

  buildUserResponse(user: UserEntity) {
    return {
      user: {
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
      },
    };
  }
}
