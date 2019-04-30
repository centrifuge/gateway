import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PERMISSIONS } from "../../../src/common/constants";

@Injectable()
export class AccountAuthGuard implements CanActivate {
  canActivate(
      context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

/**
 * Validates access to a protected route with permissions on a user
 * @async
 * @param request
 */
async validateRequest(request) {
  if (request.user.permissions.includes(PERMISSIONS.CAN_MANAGE_ACCOUNTS)) {
    return true
  }
  return false;
}
}

