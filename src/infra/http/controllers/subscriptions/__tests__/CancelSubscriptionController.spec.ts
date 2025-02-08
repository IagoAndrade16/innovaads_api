import request from 'supertest';
import { TestUtils } from '../../../../../../tests/utils/TestUtils';
import { find } from '../../../../../core/DependencyInjection';

import { CancelSubscriptionUseCase } from '../../../../../domain/modules/subscriptions/usecases/CancelSubscriptionUseCase';
import { app } from '../../../../../infra/app';

const route = '/packages/subscriptions';
const usecase = find(CancelSubscriptionUseCase);

let authToken: string;

beforeEach(async () => {
  authToken = await TestUtils.generateAuthToken();
})

it('should call usecase', async () => {
  jest.spyOn(usecase, 'execute').mockResolvedValue();

  const res = await request(app)
    .delete(route)
    .set('Authorization', authToken)
    .send();  
  
  expect(res.status).toBe(204);

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    userId: '-1'
  });
})