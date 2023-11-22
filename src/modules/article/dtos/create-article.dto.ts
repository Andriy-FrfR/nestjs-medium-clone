import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

class CreateArticleDtoArticleFields {
  @IsString()
  @Length(1)
  title: string;

  @IsString()
  @Length(1)
  description: string;

  @IsString()
  @Length(1)
  body: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagList?: string[];
}

export class CreateArticleDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateArticleDtoArticleFields)
  article: CreateArticleDtoArticleFields;
}
