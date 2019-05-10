import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as PassportLocalStrategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(PassportLocalStrategy) {
  constructor(private readonly authService: AuthService) {
    super({
      emailField: 'email@email.com',
      passwordField: 'password',
    });
  }

  /**
   * Validates a user by a specified email and password
   * @async
   * @param email
   * @param password
   */
  async validate(email: string, password: string) {
    console.log(email, password, "********")
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
