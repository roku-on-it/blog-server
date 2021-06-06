import { applyDecorators } from '@nestjs/common';
import { Length, Matches, ValidationOptions } from 'class-validator';

export function IsUsername(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    Matches(/^[\w](?!.*?\.{2})[\w.]{1,30}[\w]$/i, {
      message: '$property does not satisfy required pattern',
    }),
    Length(3, 32, validationOptions),
  );
}
