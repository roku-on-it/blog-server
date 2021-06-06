import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/module/user/user.module';
import { AuthService } from 'src/module/auth/service/auth.service';
import { RoleGuard } from 'src/module/auth/guard/role.guard';
import { AuthResolver } from './auth.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegisterProducerService } from 'src/module/auth/service/register.producer.service';
import { AppQueueModule } from 'src/module/misc/app-queue/app-queue.module';

@Module({
  imports: [AppQueueModule, ConfigModule, forwardRef(() => UserModule)],
  providers: [
    AuthService,
    RoleGuard,
    AuthResolver,
    ConfigService,
    RegisterProducerService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
