import { HttpStrategy } from './http.strategy';
import { UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { User } from '../../../src/common/models/dto/user';
import { Test } from '@nestjs/testing';

describe('HttpStrategy', function() {
  const mockUser = new User('my_username', 'my_password');

  it('should return user validation succeeds', async () => {
    const mockAuthService = {
      validateUser: jest.fn(() => mockUser),
    };
    const module = await Test.createTestingModule({
      providers: [AuthService, HttpStrategy],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    const httpStrategy = module.get<HttpStrategy>(HttpStrategy);
    const result = await httpStrategy.validate(
      mockUser.username,
      mockUser.password,
    );
    expect(result).toBe(mockUser);
  });

  it('should throw when validation fails', async () => {
    const mockAuthService = {
      validateUser: jest.fn(() => null),
    };
    const module = await Test.createTestingModule({
      providers: [AuthService, HttpStrategy],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    const httpStrategy = module.get<HttpStrategy>(HttpStrategy);

    await expect(
      httpStrategy.validate('some username', 'some password'),
    ).rejects.toThrow(UnauthorizedException);
  });
});
