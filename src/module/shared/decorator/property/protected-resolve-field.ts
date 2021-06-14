import { applyDecorators } from '@nestjs/common';
import { FieldOptions, ResolveField } from '@nestjs/graphql';
import { roleCheck } from 'src/module/shared/middleware/role-check';
import { ReturnTypeFunc } from '@nestjs/graphql/dist/interfaces/return-type-func.interface';

export function ProtectedResolveField(
  returnTypeFunction: ReturnTypeFunc,
  options?: FieldOptions,
): PropertyDecorator {
  return applyDecorators(
    ResolveField(returnTypeFunction, { ...options, middleware: [roleCheck] }),
  );
}
