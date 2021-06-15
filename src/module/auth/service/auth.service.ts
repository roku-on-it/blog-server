import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { LoginInput } from 'src/module/auth/input/login-input';
import { User } from 'src/module/user/model/user';
import { GQLContext } from 'src/module/auth/guard/interface/role';

@Injectable()
export class AuthService {
  async validate(payload: LoginInput): Promise<User> {
    return this.validateUser(payload.username, payload.password).then(
      (user) => {
        return user;
      },
    );
  }

  async validateUser(username: string, password: string): Promise<User> {
    return this.findByUsername(username).then((user) => {
      return this.comparePasswords(password, user.password).then((match) => {
        if (match) {
          return user;
        } else {
          throw new UnauthorizedException('Username or password is incorrect');
        }
      });
    });
  }

  async findByUsername(username: string): Promise<User> {
    const user = await User.findOne({ username });
    if (null == user) {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    return user;
  }

  async comparePasswords(
    inputPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(inputPassword, hashedPassword);
  }

  async logoutAndDestroySession({ req, res }: GQLContext): Promise<boolean> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return reject(false);
        }
      });

      res.clearCookie('qid');

      return resolve(true);
    });
  }
}
