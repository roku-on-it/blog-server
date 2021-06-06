import { applyDecorators } from '@nestjs/common';
import { Length, Matches, ValidationOptions } from 'class-validator';

export function IsPassword(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    Matches(/^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d).{8,}$/u, {
      message: '$property does not satisfy required pattern',
    }),
    Length(8, 64, validationOptions),
  );
}
