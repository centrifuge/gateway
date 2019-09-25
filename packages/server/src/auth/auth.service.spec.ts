import { Test } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { User } from '@centrifuge/gateway-lib/models/user';
import { databaseServiceProvider } from '../database/database.providers';
import { DatabaseService } from '../database/database.service';

describe('LocalStrategy', () => {
  const unhashedPassword = 'my_password';
  const hashedPassword = '$2b$12$qI.Lyik/2lJvLwfK74xFee7mOVWyKm0K20YPv4zlfis2dNOh2LJdO';
  const mockUser: User = {
    ...(new User()),
    name: 'my_username',
    _id: 'user_id',
    email: 'test@test.test',
    account: '0x3333',
    enabled: true,
    invited: false,
    permissions: [],
  };

  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, databaseServiceProvider],
    }).compile();
    const databaseService = module.get<DatabaseService>(DatabaseService);
    databaseService.users.insert({
      ...mockUser,
      password: hashedPassword,
    });

    authService = module.get<AuthService>(AuthService);
  });

  it('should return user if credentials are valid', async () => {
    const result = await authService.validateUser(
      mockUser.email,
      unhashedPassword,
    );
    expect(result).toMatchObject({
      ...mockUser,
      password: hashedPassword,
    });
  });

  it('should return null if username is invalid', async () => {
    const result = await authService.validateUser(
      'invalid username',
      'mockUser.password',
    );
    expect(result).toBe(null);
  });

  it('should return null if password is invalid', async () => {
    const result = await authService.validateUser(
      mockUser.name,
      'invalid password',
    );
    expect(result).toBe(null);
  });
});
