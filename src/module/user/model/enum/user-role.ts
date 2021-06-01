import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  Root = 30,
  Admin = 20,
  Mod = 10,
  User = 0,
}

registerEnumType(UserRole, {
  name: 'UserRole',
});
