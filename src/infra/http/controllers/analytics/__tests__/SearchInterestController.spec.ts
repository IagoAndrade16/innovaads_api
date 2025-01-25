import request from 'supertest';
import { app } from '../../../../app';
import { find } from '../../../../../core/DependencyInjection';
import { SearchInterestUseCase } from '../../../../../domain/modules/analytics/usecases/SearchInterestUseCase';
import { TestUtils } from '../../../../../../tests/utils/TestUtils';
import { FetchInterestOverTimeOutput } from '../../../../../providers/trends/dtos/interestOverTimeTrendsDTO';

const route = '/analytics/trends/search-interest';
const usecase = find<SearchInterestUseCase>(SearchInterestUseCase);

let authToken: string;
beforeAll(async () => {
  authToken = await TestUtils.generateAuthToken();
});

describe('Schema validation', () => {
  it('should return 401 if user is not authenticated', async () => {
    const response = await request(app).get(route);

    expect(response.status).toBe(401);
  }); 

  it('should validate requires params', async () => {
    const response = await request(app)
      .get(route)
      .set('Authorization', authToken);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('keyword');  
  });
});

it('should call usecase with correct params and return trends', async () => {
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