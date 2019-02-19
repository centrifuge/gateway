import { UsersController } from './users.controller';
import { DatabaseProvider } from '../database/database.providers';
import { User } from '../../../src/common/models/user';
import config from '../config';
import { CentrifugeClient } from '../centrifuge-client/centrifuge.interfaces';

describe('Users controller', function() {
  const centrifugeClientMock = ({
    accounts: {
      generateAccount: jest.fn(() => ({
        identity_id: 'generated_identity_id',
      })),
    },
  } as any) as CentrifugeClient;

  describe('logout', function() {
    it('should call request logout', async function() {
      const usersController = new UsersController(
        {} as DatabaseProvider,
        centrifugeClientMock,
      );
      const request = {
        logout: jest.fn(),
      };

      const response = {
        redirect: jest.fn(),
      };
      await usersController.logout(request, response);
      expect(request.logout).toHaveBeenCalledTimes(1);
      expect(response.redirect).toHaveBeenCalledWith('/');
    });
  });

  describe('when in invite mode', function() {
    let registeredUser: User;

    const dbMock = ({
      users: {
        findOne: (user): User | undefined =>
          user.username === registeredUser.username
            ? registeredUser
            : undefined,
        updateById: (userId) => ({ _id: userId }),
        create: data => ({ ...data, _id: 'new_user_id' }),
      },
    } as any) as DatabaseProvider;

    const usersController = new UsersController(dbMock, centrifugeClientMock);

    beforeEach(() => {
      jest.clearAllMocks();
      registeredUser = {
        _id: 'user',
        username: 'username',
        password: 'password',
        enabled: true,
        invited: false,
        permissions: [],
      };
    });

    let inviteOnly;

    beforeAll(() => {
      inviteOnly = config.inviteOnly;
      config.inviteOnly = true;
    });

    afterAll(() => {
      config.inviteOnly = inviteOnly;
    });

    describe('invite', function() {
      it('should create user if invited', function() {});

      it('should throw error if user is not invited', function() {});
    });

    describe('register', function() {
      it('should throw if the username is taken and there is an enabled user', async function() {
        registeredUser.invited = true;
        registeredUser.enabled = true;
        await expect(usersController.register(registeredUser)).rejects.toThrow(
          'Username taken!',
        );
      });

      it('should throw if the user has not been invited', async function() {
        const notInvitedUser: User = {
          _id: 'some_user_id',
          username: 'new_user',
          password: 'password',
          invited: false,
          enabled: true,
          permissions: [],
        };

        await expect(usersController.register(notInvitedUser)).rejects.toThrow(
          'This user has not been invited!',
        );
      });

      it('should create the user if the username is not taken and the user has been invited', async function() {
        registeredUser.invited = true;
        registeredUser.enabled = false;
        const result = await usersController.register(registeredUser);

        expect(result).toEqual({ id: 'user' });
      });
    });
  });

  describe('when not in invite mode', function() {
    let inviteOnly;

    beforeAll(() => {
      inviteOnly = config.inviteOnly;
      config.inviteOnly = false;
    });

    afterAll(() => {
      config.inviteOnly = inviteOnly;
    });

    describe('register', function() {
      const registeredUser: User = {
        _id: 'user',
        username: 'username',
        password: 'password',
        enabled: true,
        invited: false,
        permissions: [],
      };

      const dbMock = ({
        users: {
          findOne: (user): User | undefined =>
            user.username === registeredUser.username
              ? registeredUser
              : undefined,
          create: jest.fn(data => ({ ...data, _id: 'new_user_id' })),
        },
      } as any) as DatabaseProvider;

      const usersController = new UsersController(dbMock, centrifugeClientMock);

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return error if the username is taken', async function() {
        await expect(usersController.register(registeredUser)).rejects.toThrow(
          'Username taken!',
        );
      });

      it('should create the user if the username is not taken', async function() {
        const newUser = {
          _id: 'some_user_id',
          username: 'new_user',
          password: 'password',
          permissions: [],
        };
        const result = await usersController.register(newUser);
        expect(dbMock.users.create).toHaveBeenCalledWith(
          expect.objectContaining({
            username: newUser.username,
            enabled: true,
            invited: false,
            permissions: [],
            password: expect.any(String),
          }),
        );
        expect(result).toEqual({ id: 'new_user_id' });
      });
    });

    describe('invite', function() {
      const usersController = new UsersController(
        ({} as any) as DatabaseProvider,
        centrifugeClientMock,
      );

      it('should throw error', async function() {
        await expect(
          usersController.inviteUser({ username: 'any_username' }),
        ).rejects.toThrow('Invite functionality not enabled!');
      });
    });
  });
});
