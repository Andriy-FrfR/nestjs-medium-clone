import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Length, ValidateNested } from 'class-validator';

class CreateCommentDtoCommentFields {
  @IsString()
  @Length(1)
  body: string;
}

export class CreateCommentDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateCommentDtoCommentFields)
  comment: CreateCommentDtoCommentFields;
}
