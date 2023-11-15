import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

class LoginDtoUserFields {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LoginDtoUserFields)
  user: LoginDtoUserFields;
}
