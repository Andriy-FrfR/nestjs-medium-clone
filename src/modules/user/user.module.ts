import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module(TypeOrmModule.forFeature([]))
export class UserModule {}
