import request from 'supertest';
import { app } from '../../../../app';
import { find } from '../../../../../core/DependencyInjection';
import { SearchInterestUseCase } from '../../../../../domain/modules/analytics/usecases/SearchInterestUseCase';
import { TestUtils } from '../../../../../../tests/utils/TestUtils';
import { FetchInterestOverTimeOutput } from '../../../../../providers/trends/dtos/interestOverTimeTrendsDTO';
import { UsersRepository, usersRepositoryAlias } from '../../../../../domain/modules/users/repositories/UsersRepository';
import { User } from '../../../../../domain/modules/users/entities/User';

const route = '/analytics/trends/search-interest';
const usecase = find<SearchInterestUseCase>(SearchInterestUseCase);
const usersRepo = find<UsersRepository>(usersRepositoryAlias);

const user = new User();
user.subscriptionStatus = 'active';
let authToken: string;
beforeAll(async () => {
  authToken = await TestUtils.generateAuthToken();
});

describe('Schema validation', () => {
  it('should return 401 if user is not authenticated', async () => {
    jest.spyOn(usersRepo, 'findById').mockResolvedValue(user);

    const response = await request(app).get(route);

    expect(response.status).toBe(401);
  }); 

  it('should validate requires params', async () => {
    jest.spyOn(usersRepo, 'findById').mockResolvedValue(user);

    const response = await request(app)
      .get(route)
      .set('Authorization', authToken);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('keyword');  
  });
});

it('should call usecase with correct params and return trends', async () => {
  jest.spyOn(usersRepo, 'findById').mockResolvedValue(user);

  jest.spyOn(usecase, 'execute').mockResolvedValue({} as FetchInterestOverTimeOutput);

  const response = await request(app)
    .get(route)
    .query({
      keyword: 'test',
    })
    .set('Authorization', authToken);


  expect(response.status).toBe(200);
  expect(usecase.execute).toHaveBeenCalled();
  expect(response.body).toHaveProperty('result');
});