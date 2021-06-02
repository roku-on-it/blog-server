import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/module/user/user.module';
import { AuthService } from 'src/module/auth/service/auth.service';
import { JwtStrategy } from 'src/module/auth/guard/jwt.strategy';
import { RoleGuard } from 'src/module/auth/guard/role.guard';
import { JwtGuard } from 'src/module/auth/guard/jwt.guard';
import { AuthResolver } from './auth.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [
    AuthService,
    RoleGuard,
    JwtGuard,
    JwtStrategy,
    AuthResolver,
    ConfigService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
