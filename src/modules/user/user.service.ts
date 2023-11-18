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

  async getUserWithFollowedUsers(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['followedBy'],
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  async createFollow(
    userToFollowUsername: string,
    currentUser: UserEntity,
  ): Promise<UserEntity> {
    const userToFollow = await this.userRepository.findOne({
      where: { username: userToFollowUsername },
      relations: ['followedBy'],
    });

    if (!userToFollow)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (currentUser.id === userToFollow.id)
      throw new HttpException(
        "User can't follow themself",
        HttpStatus.BAD_REQUEST,
      );

    if (userToFollow.followedBy.find((user) => user.id === currentUser.id))
      throw new HttpException(
        'User is already followed',
        HttpStatus.BAD_REQUEST,
      );

    userToFollow.followedBy.push(currentUser);

    return this.userRepository.save(userToFollow);
  }

  async deleteFollow(
    userToUnfollowUsername: string,
    currentUser: UserEntity,
  ): Promise<UserEntity> {
    const userToUnfollow = await this.userRepository.findOne({
      where: { username: userToUnfollowUsername },
      relations: ['followedBy'],
    });

    if (!userToUnfollow)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (currentUser.id === userToUnfollow.id)
      throw new HttpException(
        "User can't unfollow themself",
        HttpStatus.BAD_REQUEST,
      );

    if (!userToUnfollow.followedBy.find((user) => user.id === currentUser.id))
      throw new HttpException(
        'User is already unfollowed',
        HttpStatus.BAD_REQUEST,
      );

    userToUnfollow.followedBy.splice(
      userToUnfollow.followedBy.findIndex((user) => user.id === currentUser.id),
      1,
    );

    return this.userRepository.save(userToUnfollow);
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

  buildProfileResponse(user: UserEntity, currentUser?: UserEntity) {
    return {
      profile: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: Boolean(
          user.followedBy.find((user) => user.id === currentUser?.id),
        ),
      },
    };
  }
}
