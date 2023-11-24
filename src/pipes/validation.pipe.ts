import {
  ArgumentMetadata,
  PipeTransform,
  HttpException,
  HttpStatus,
  ValidationError,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype) return value;

    const object = plainToInstance(metadata.metatype, value);

    if (typeof object !== 'object') {
      return value;
    }

    const errors = await validate(object);

    if (errors.length === 0) {
      return value;
    }

    throw new HttpException(
      { errors: this.formatErrors(errors) },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  private formatErrors(errors: ValidationError[]) {
    const formattedErrors = {};

    errors.map((error: ValidationError) => {
      if (error.constraints !== undefined) {
        formattedErrors[error.property] = [...Object.values(error.constraints)];
      }

      error.children?.map((error: ValidationError) => {
        if (error.constraints !== undefined) {
          formattedErrors[error.property] = [
            ...Object.values(error.constraints),
          ];
        }
      });
    });

    return formattedErrors;
  }
}
