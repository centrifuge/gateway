import { UsersController } from './users.controller';
import { databaseConnectionFactory, DatabaseProvider } from '../database/database.providers';
import { User } from '../../../src/common/models/user';
import config from '../config';
import { CentrifugeClient } from '../centrifuge-client/centrifuge.interfaces';
import { Test, TestingModule } from '@nestjs/testing';
import { SessionGuard } from '../auth/SessionGuard';
import { centrifugeClientFactory } from '../centrifuge-client/centrifuge.client';
import { tokens as databaseTokens } from '../database/database.constants';
import { tokens as clientTokens } from '../centrifuge-client/centrifuge.constants';

describe('Users controller', () => {
  const centrifugeClientMock = ({
    accounts: {
      generateAccount: jest.fn(() => ({
        identity_id: 'generated_identity_id',
      })),
    },
  } as any) as CentrifugeClient;

  let registeredUser;
  let userModule: TestingModule;

  class DatabaseServiceMock {
    users = {
      findOne: (user): User | undefined =>
      user.username === registeredUser.username
        ? registeredUser
        : undefined,
      updateById: (userId,user,upsert) => user ,
      insert: data => ({ ...data, _id: 'new_user_id' }),
    }
  }

  const databaseServiceMock = new DatabaseServiceMock();

  beforeAll(async () => {
    userModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        SessionGuard,
        centrifugeClientFactory,
        databaseConnectionFactory,
      ],
    })
      .overrideProvider(databaseTokens.databaseConnectionFactory)
      .useValue(databaseServiceMock)
      .overrideProvider(clientTokens.centrifugeClientFactory)
      .useValue(centrifugeClientMock)
      .compile();

  })

  describe('logout', () => {
    it('should call request logout', async () => {
      const usersController =  userModule.get<
        UsersController
        >(UsersController);

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

  describe('when in invite mode', () => {


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
    let usersController

    beforeAll(() => {
      usersController =  userModule.get<
        UsersController
        >(UsersController)
      inviteOnly = config.inviteOnly;
      config.inviteOnly = true;
    });

    afterAll(() => {
      config.inviteOnly = inviteOnly;
    });

    describe('invite', () => {
      it('should create user if invited', () => {});

      it('should throw error if user is not invited', () => {});
    });

    describe('register', () => {
      it('should throw if the username is taken and there is an enabled user', async () => {
        registeredUser.invited = true;
        registeredUser.enabled = true;
        await expect(usersController.register(registeredUser)).rejects.toThrow(
          'Username taken!',
        );
      });

      it('should throw if the user has not been invited', async () => {
        const notInvitedUser: User = {
          _id: 'some_user_id',
          username: 'new_user',
          password: 'password',
          invited: false,
          enabled: true,
          permissions: [],
        };

        await expect(usersController.register(notInvitedUser)).rejects.toThrow(
          'Username taken!',
        );
      });

      it('should create the user if the username is not taken and the user has been invited', async () => {
        registeredUser.invited = true;
        registeredUser.enabled = false;
        const result = await usersController.register(registeredUser);

        expect(result).toEqual('user');
      });
    });
  });

  describe('when not in invite mode', () => {
    let inviteOnly;
    let usersController;
    beforeAll(() => {
      usersController =  userModule.get<
        UsersController
        >(UsersController)
      inviteOnly = config.inviteOnly;
      config.inviteOnly = false;
    });

    afterAll(() => {
      config.inviteOnly = inviteOnly;
    });

    describe('register', () => {
      const registeredUser: User = {
        _id: 'user',
        username: 'username',
        password: 'password',
        enabled: true,
        invited: false,
        permissions: [],
      };


      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return error if the username is taken', async () => {
        await expect(usersController.register(registeredUser)).rejects.toThrow(
          'Username taken!',
        );
      });

      it('should create the user if the username is not taken', async () => {
        const newUser = {
          _id: 'some_user_id',
          username: 'new_user',
          password: 'password',
          enabled:false,
          invited:null,
          permissions: [],
        };
        //TODO Revisit all tests
        const result = await usersController.register(newUser);
        expect(result).toEqual('some_user_id');
      });
    });

    describe('invite', () => {
      const usersController = new UsersController(
        ({} as any) as DatabaseProvider,
        centrifugeClientMock,
      );

      it('should throw error', async () => {
        await expect(
          usersController.inviteUser({ username: 'any_username' }),
        ).rejects.toThrow('Invite functionality not enabled!');
      });
    });
  });
});
