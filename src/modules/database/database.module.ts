import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE_NAME'),
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
