import request from 'supertest';
import { TestUtils } from '../../../../../../tests/utils/TestUtils';
import { find } from '../../../../../core/DependencyInjection';
import { ConnectFacebookAccountUseCase } from '../../../../../domain/modules/users/usecases/ConnectFacebookAccountUseCase';
import { app } from '../../../../../infra/app';
import { FacebookCredential } from '../../../../../domain/modules/users/entities/FacebookCredential';

const route = '/users/facebook-account/connect';
const usecase = find(ConnectFacebookAccountUseCase);

let authToken: string;

beforeAll(async () => {
  authToken = await TestUtils.generateAuthToken(-1);
})

describe('Schema Validation', () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).post(route)
    .send({});

    expect(res.status).toBe(401);
  })

  it('should validate required params', async () => {
    const res = await request(app)
      .post(route)
      .set('Authorization', `${authToken}`)
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('expiresIn');
    expect(res.body).toHaveProperty('userIdOnFacebook');
  })
})

it('should call usecase', async () => {
  const mockedUsecaseRes = {
    facebookCredential: {} as FacebookCredential
  }

  jest.spyOn(usecase, 'execute').mockResolvedValue(mockedUsecaseRes);

  const res = await request(app)
    .post(route)
    .set('Authorization', `${authToken}`)
    .send({
      accessToken: '123456',
      expiresIn: 123456,
      userIdOnFacebook: '123456'
    });

  expect(res.status).toBe(200);
  expect(res.body).toEqual(mockedUsecaseRes);

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    accessToken: '123456',
    expiresIn: 123456,
    userIdOnFacebook: '123456',
    userId: expect.any(String)
  });
})