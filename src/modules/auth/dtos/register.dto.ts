import { Type } from 'class-transformer';
import { IsEmail, IsString, Length, ValidateNested } from 'class-validator';

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
  @ValidateNested()
  @Type(() => RegisterDtoUserFields)
  user: RegisterDtoUserFields;
}
