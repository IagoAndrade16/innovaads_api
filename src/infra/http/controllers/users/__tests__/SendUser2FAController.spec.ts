import request from 'supertest';
import { TestUtils } from '../../../../../../tests/utils/TestUtils';
import { find } from '../../../../../core/DependencyInjection';
import { SendUser2FAUseCase } from '../../../../../domain/modules/users/usecases/SendUser2FAUseCase';
import { app } from '../../../../../infra/app';


const route = '/users/2fa';
const usecase = find(SendUser2FAUseCase);

let authToken: string;

beforeAll(async () => {
  authToken = await TestUtils.generateAuthToken(-1);
})

describe('Schema validation', () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get(route)
    .send({});

    expect(res.status).toBe(401);
  })
})

it('should call usecase and return 204', async () => {
  jest.spyOn(usecase, 'execute').mockResolvedValue();

  const res = await request(app).get(route)
  .set('Authorization', `${authToken}`)
  .send();  

  expect(res.status).toBe(204);

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    userId: '-1',
  });
})