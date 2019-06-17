import { UsersController } from './users.controller';
import { databaseServiceProvider } from '../database/database.providers';
import { User } from '../../../src/common/models/user';
import config from '../../../src/common/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SessionGuard } from '../auth/SessionGuard';
import { CentrifugeService } from '../centrifuge-client/centrifuge.service';
import { DatabaseService } from '../database/database.service';
import { PERMISSIONS } from '../../../src/common/constants';

describe('Users controller', () => {
  const userAccount = 'generated_identity_id';
  const centrifugeClientMock = ({
    accounts: {
      generateAccount: jest.fn(() => ({
        identity_id: userAccount,
      })),
    },
  } as any) as CentrifugeService;

  let invitedUser: User;
  let enabledUser: User;
  let userModule: TestingModule;


  beforeAll(async () => {
    userModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        SessionGuard,
        CentrifugeService,
        databaseServiceProvider,
      ],
    })
      .overrideProvider(CentrifugeService)
      .useValue(centrifugeClientMock)
      .compile();

    const databaseService = userModule.get<DatabaseService>(DatabaseService);

    invitedUser = await databaseService.users.insert({
      name: 'username',
      email: 'test1',
      account: '0x333',
      password: 'password',
      enabled: false,
      invited: true,
      permissions: [],
    });


    enabledUser = await databaseService.users.insert({
      name: 'username',
      email: 'test2',
      account: '0x333',
      password: 'password',
      enabled: true,
      invited: false,
      permissions: [],
    });


  });

  describe('logout', () => {
    it('should call request logout', async () => {
      const usersController = userModule.get<UsersController>(UsersController);

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
    });

    let inviteOnly;
    let usersController;

    beforeAll(() => {
      usersController = userModule.get<UsersController>(UsersController);
      inviteOnly = config.inviteOnly;
      config.inviteOnly = true;
    });

    afterAll(() => {
      config.inviteOnly = inviteOnly;
    });

    describe('invite', () => {
      it('should fail if the user exists', async () => {
        await expect(usersController.invite(invitedUser)).rejects.toThrow(
          'User already invited!',
        );
      });
      it('should add user to the database with invite true and enabled false', async () => {

        const user: User = {
          ...new User(),
          name: 'new_user',
          password: 'password',
          email: 'test1' + Math.random(),
        };

        const invited = await usersController.invite(user);
        expect(invited).toMatchObject({
          ...user,
          password: undefined,
          invited: true,
          enabled: false,
          account: userAccount,
        });
      });


    });

    describe('register', () => {
      it('should throw if the username is taken and there is an enabled user', async () => {

        await expect(usersController.register(enabledUser)).rejects.toThrow(
          'Email taken!',
        );
      });

      it('should throw if the user has not been invited', async () => {
        const notInvitedUser: User = {
          _id: 'some_user_id',
          name: 'new_user',
          email: 'test',
          account: '0x55',
          password: 'password',
          invited: false,
          enabled: true,
          permissions: [],
        };

        await expect(usersController.register(notInvitedUser)).rejects.toThrow(
          'Email taken!',
        );
      });

      it('should create the user if the user has been invited', async () => {

        const user:any = {
          ...invitedUser
        }

        const result = await usersController.register(invitedUser);
        // remove fields that changed but the method and we do care to test
        delete user.password;
        delete user.updatedAt;
        expect(result).toMatchObject({
          ...user,
          enabled: true,
        });
      });
    });
  });

  describe('when not in invite mode', () => {
    let inviteOnly;
    let usersController;
    beforeAll(() => {
      usersController = userModule.get<UsersController>(UsersController);
      inviteOnly = config.inviteOnly;
      config.inviteOnly = false;
    });

    afterAll(() => {
      config.inviteOnly = inviteOnly;
    });

    describe('register', () => {


      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return error if the email is taken', async () => {
        await expect(usersController.register(invitedUser)).rejects.toThrow(
          'Email taken!',
        );
      });

      it('should create the user if the username is not taken', async () => {
        const newUser = {
          name: 'new_user',
          email: 'new_email',
          enabled: false,
          invited: false,
          password: 'somepassword',
          permissions: [],
        };


        const result = await usersController.register(newUser);
        expect(result).toMatchObject({
          ...newUser,
          password: result.password,
          enabled: true,
        });
      });
      it('should not create the user if the password is empty or not set', async () => {

        await expect(
          usersController.register({
            _id: 'undefinedPassword',
            name: 'new_user',
            email: 'new_email',
            password: undefined,
            account: '0x444',
            enabled: false,
            invited: false,
            permissions: [],
          }),
        ).rejects.toThrow(
          'Password is mandatory',
        );

        await expect(
          usersController.register({
            _id: 'undefinedPassword',
            name: 'new_user',
            email: 'new_email',
            account: '0x444',
            password: null,
            enabled: false,
            invited: false,
            permissions: [],
          }),
        ).rejects.toThrow(
          'Password is mandatory',
        );


        await expect(
          usersController.register({
            _id: 'undefinedPassword',
            name: 'new_user',
            email: 'new_email',
            account: '0x444',
            password: '  ',
            enabled: false,
            invited: false,
            permissions: [],
          }),
        ).rejects.toThrow(
          'Password is mandatory',
        );

      });

    });

    describe('invite', () => {
      const usersController = new UsersController(
        ({} as any) as DatabaseService,
        centrifugeClientMock,
      );

      it('should throw error', async () => {
        await expect(
          usersController.invite({
            name: 'any_username',
            email: 'test',
            permissions: [PERMISSIONS.CAN_CREATE_INVOICES],
          }),
        ).rejects.toThrow('Invite functionality not enabled!');
      });
    });
  });
});
