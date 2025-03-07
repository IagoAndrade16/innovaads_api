import request from 'supertest';
import { TestUtils } from '../../../../../../tests/utils/TestUtils';
import { find } from '../../../../../core/DependencyInjection';
import { app } from '../../../../app';
import { DisconnectGoogleAccountUseCase } from '../../../../../domain/modules/users/usecases/DisconnectGoogleAccountUseCase';

const route = '/users/google-account/disconnect';
const usecase = find<DisconnectGoogleAccountUseCase>(DisconnectGoogleAccountUseCase);

let authToken: string;
beforeAll(async () => {
  authToken = await TestUtils.generateAuthToken();
});

describe('Schema Validation', () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get(route)

    expect(res.status).toBe(401);
  });
});

it('should call usecase', async () => {
  jest.spyOn(usecase, 'execute').mockResolvedValue();

  const res = await request(app)
    .get(route)
    .set({
      Authorization: authToken,
    });

  expect(res.status).toBe(204);

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    userId: '-1',
  });
});