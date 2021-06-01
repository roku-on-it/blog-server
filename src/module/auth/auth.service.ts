import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateJwt({ id, username, role, fullName }): Promise<string> {
    return this.jwtService.signAsync({ id, username, role, fullName });
  }

  async comparePasswords(
    inputPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(inputPassword, hashedPassword);
  }
}
