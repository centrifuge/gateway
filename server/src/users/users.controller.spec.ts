import { UsersController } from './users.controller';

describe('Users controller', function() {
  describe('logout', function() {
    it('should call request logout', async function() {
      const usersController = new UsersController();
      const request = {
        logout: jest.fn(),
      };
      await usersController.logout(request);
      expect(request.logout).toHaveBeenCalledTimes(1);
    });
  });
});
