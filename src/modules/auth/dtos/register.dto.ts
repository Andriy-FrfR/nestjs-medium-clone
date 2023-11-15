import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

class RegisterDtoUserFields {
  @IsString()
  @Length(1)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(1)
  password: string;
}

export class RegisterDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RegisterDtoUserFields)
  user: RegisterDtoUserFields;
}
