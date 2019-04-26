import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// is this the right strategy to extend?
import { Strategy as PassportLocalStrategy } from 'passport-local';
import { AuthService } from './auth.service';
import {PERMISSIONS} from "../../../src/common/constants";

@Injectable()
export class PermissionsStrategy extends PassportStrategy(PassportLocalStrategy, 'permission') {
constructor(private readonly authService: AuthService) {
super({
usernameField: 'username',
passwordField: 'password',
// permission
});
}

/**
 * Validates access to a protected route with permissions on a user
 * @async
 * @param username
 * @param password
 * @param necessary permission
 */
async validate(username: string, password: string, permission: PERMISSIONS) {
const user = await this.authService.validatePermissions(username, password, permission);
if (!user) {
throw new UnauthorizedException();
}
return user;
}
}
