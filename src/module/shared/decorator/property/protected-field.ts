import { applyDecorators } from '@nestjs/common';
import { UserRole } from 'src/module/user/model/enum/user-role';
import { Extensions, Field, FieldOptions } from '@nestjs/graphql';
import { roleCheck } from 'src/module/shared/middleware/role-check';
import { ReturnTypeFunc } from '@nestjs/graphql/dist/interfaces/return-type-func.interface';

export function ProtectedField(
  role: UserRole,
  returnTypeFunction?: ReturnTypeFunc,
  options?: FieldOptions,
): PropertyDecorator {
  return applyDecorators(
    Field(returnTypeFunction, { middleware: [roleCheck], ...options }),
    Extensions({ role: role }),
  );
}
