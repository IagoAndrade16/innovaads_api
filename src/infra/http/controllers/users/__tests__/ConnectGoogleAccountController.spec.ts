import request from 'supertest';
import { TestUtils } from '../../../../../../tests/utils/TestUtils';
import { find } from '../../../../../core/DependencyInjection';
import { app } from '../../../../app';
import { ConnectGoogleAccountUseCase, ConnectGoogleAccountUseCaseOutput } from '../../../../../domain/modules/users/usecases/ConnectGoogleAccountUseCase';

const route = '/users/google-account/connect';
const usecase = find<ConnectGoogleAccountUseCase>(ConnectGoogleAccountUseCase);

let authToken: string;
beforeAll(async () => {
  authToken = await TestUtils.generateAuthToken();
});

describe('Schema Validation', () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get(route)

    expect(res.status).toBe(401);
  });

  it('should return 400 if invalid token is provided', async () => {
    const res = await request(app)
      .get(route)
      .set({
        Authorization: authToken,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('code');
  });    
});

it('should call usecase', async () => {
  jest.spyOn(usecase, 'execute').mockResolvedValue({
    googleCredential: {
      id: 'id',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      deleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresIn: new Date(),
      expiresRefreshIn: new Date(),
      userId: '-1',
    }
  } as ConnectGoogleAccountUseCaseOutput);

  const res = await request(app)
    .get(route)
    .set({
      Authorization: authToken,
    })
    .query({
      code: 'code'
    });

  expect(res.status).toBe(200);
  expect(res.body).toMatchObject({
    googleCredential: {
      id: 'id',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      deleted: false,
      deletedAt: null,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      expiresIn: expect.any(String),
      expiresRefreshIn: expect.any(String),
      userId: '-1',
    }
  })

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    code: 'code',
    userId: '-1',
  });
});