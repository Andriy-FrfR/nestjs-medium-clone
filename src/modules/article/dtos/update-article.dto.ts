import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

class UpdateArticleDtoArticleFields {
  @IsOptional()
  @IsString()
  @Length(1)
  title: string;

  @IsOptional()
  @IsString()
  @Length(1)
  description: string;

  @IsOptional()
  @IsString()
  @Length(1)
  body: string;
}

export class UpdateArticleDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateArticleDtoArticleFields)
  article: UpdateArticleDtoArticleFields;
}
