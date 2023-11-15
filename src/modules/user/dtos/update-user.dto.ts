import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

class UpdateUserDtoUserFields {
  @IsOptional()
  @IsString()
  @Length(1)
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(1)
  password: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  image: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateUserDtoUserFields)
  user: UpdateUserDtoUserFields;
}
