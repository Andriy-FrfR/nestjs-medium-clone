import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { AttachUserToRequestMiddleware } from './middlewares/attach-user-to-request.middleware';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule),
  ],
  exports: [TypeOrmModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AttachUserToRequestMiddleware).forRoutes('*');
  }
}
