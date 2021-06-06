import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { AuthService } from 'src/module/auth/service/auth.service';

@Module({
  providers: [UserResolver, AuthService],
})
export class UserModule {}
