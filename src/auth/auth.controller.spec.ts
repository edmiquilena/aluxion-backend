import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    login: jest.fn((dto) => {
      return {
        access_token: 'token',
        user: {
          username: 'username',
          email: 'email',
          sub: 'userid',
        },
      };
    }),

    register: jest.fn((dto) => {
      return {
        success: true,
        user: {
          username: 'admin',
          email: 'admin@google.com',
        },
      };
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined along with controllers', () => {
    expect(controller).toBeDefined();
    expect(controller.loginUser).toBeDefined();
    expect(controller.registerUser).toBeDefined();
    expect(controller.requestPasswordReset).toBeDefined();
    expect(controller.resetPassword).toBeDefined();
  });
  it('should login user', () => {
    expect(
      controller.loginUser({
        username: 'admin@google.com',
        password: '12345secure',
      }),
    ).toEqual({ access_token: expect.any(String), user: expect.any(Object) });
  });

  it('should register user', () => {
    expect(
      controller.registerUser({
        username: 'admin',
        email: 'admin@google.com',
        password: '12345secure',
      }),
    ).toEqual({ success: expect.any(Boolean), user: expect.any(Object) });
  });
});
