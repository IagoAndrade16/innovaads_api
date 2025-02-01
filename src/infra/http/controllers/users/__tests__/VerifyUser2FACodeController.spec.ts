import request from 'supertest';
import { TestUtils } from '../../../../../../tests/utils/TestUtils';
import { find } from '../../../../../core/DependencyInjection';
import { app } from '../../../../../infra/app';
import { VerifyUser2FACodeUseCase } from '../../../../../domain/modules/users/usecases/VerifyUser2FACodeUseCase';


const route = '/users/2fa/verify';
const usecase = find(VerifyUser2FACodeUseCase);

let authToken: string;

beforeAll(async () => {
  authToken = await TestUtils.generateAuthToken(-1);
})

describe('Schema validation', () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).post(route)
    .send({});

    expect(res.status).toBe(401);
  })

  it('should require necessary parameters', async () => {
    const res = await request(app).post(route)
    .set('Authorization', `${authToken}`)
    .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('code');
  })
})

it('should call usecase and return 204', async () => {
  jest.spyOn(usecase, 'execute').mockResolvedValue();

  const res = await request(app).post(route)
  .set('Authorization', `${authToken}`)
  .send({ code: '123' });  

  expect(res.status).toBe(204);

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    userId: '-1',
    code: '123',
  });
})