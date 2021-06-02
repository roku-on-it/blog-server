import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/module/auth/service/auth.service';
import { plainToClass } from 'class-transformer';
import { User } from 'src/module/user/model/user';
import { JwtResponse } from 'src/module/auth/model/jwt-response';
import { ForbiddenException } from '@nestjs/common';
import { CreateUser } from 'src/module/user/input/create-user';
import { LoginInput } from 'src/module/auth/input/login-input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async register(@Args('payload') payload: CreateUser): Promise<User> {
    return plainToClass(User, payload).save();
  }

  @Mutation(() => JwtResponse)
  async login(@Args('payload') payload: LoginInput): Promise<JwtResponse> {
    return this.validate(payload);
  }

  async validate(payload: LoginInput): Promise<JwtResponse> {
    return this.validateUser(payload.username, payload.password).then(
      (user) => {
        return this.authService.generateJwt(user).then((jwt) => {
          return {
            token: jwt,
          };
        });
      },
    );
  }

  async validateUser(username: string, password: string): Promise<User> {
    return this.findByUsername(username).then((user) => {
      return this.authService
        .comparePasswords(password, user.password)
        .then((match) => {
          if (match) {
            return user;
          } else {
            throw new ForbiddenException('Username or password is incorrect');
          }
        });
    });
  }

  async findByUsername(username: string): Promise<User> {
    const user = await User.findOne({ username });

    if (null == user) {
      throw new ForbiddenException('Username or password is incorrect');
    }

    return user;
  }
}
