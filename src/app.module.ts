import { Module } from '@nestjs/common';

import { ArticleModule } from './modules/article/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from './modules/config/config.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    ArticleModule,
    CommentModule,
  ],
})
export class AppModule {}
