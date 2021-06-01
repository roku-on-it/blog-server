import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/module/auth/guard/role.guard';
import { UserRole } from 'src/module/user/model/enum/user-role';
import { GqlAuthGuard } from 'src/module/auth/guard/gql-auth';

export const Authorize = (role?: UserRole) =>
  applyDecorators(
    SetMetadata('role', role),
    UseGuards(GqlAuthGuard, RoleGuard),
  );
