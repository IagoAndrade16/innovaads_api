import request from 'supertest';
import { TestUtils } from '../../../../../../tests/utils/TestUtils';
import { find } from '../../../../../core/DependencyInjection';
import { DisconnectFacebookAccountUseCase } from '../../../../../domain/modules/users/usecases/DisconnectFacebookAccountUseCase';
import { app } from '../../../../app';

const route = '/users/facebook-account/disconnect';
const usecase = find(DisconnectFacebookAccountUseCase);

let authToken: string;

beforeAll(async () => {
  authToken = await TestUtils.generateAuthToken(-1);
})

describe('Schema Validation', () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).delete(route)
    .send({});

    expect(res.status).toBe(401);
  })
})

it('should call usecase', async () => {
  jest.spyOn(usecase, 'execute').mockResolvedValue();

  const res = await request(app)
    .delete(route)
    .set('Authorization', `${authToken}`)
    .send({});

  expect(res.status).toBe(204);

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    userId: expect.any(String)
  });
})