import request from 'supertest';
import { app } from '../../../../app';
import { find } from '../../../../../core/DependencyInjection';
import { TestUtils } from '../../../../../../tests/utils/TestUtils';
import { FetchDailyTrendsUseCase, FetchDailyTrendsUseCaseOutput } from '../../../../../domain/modules/analytics/usecases/FetchDailyTrendsUseCase';


const route = '/analytics/trends/daily';
const usecase = find<FetchDailyTrendsUseCase>(FetchDailyTrendsUseCase);

let authToken: string;
beforeAll(async () => {
  authToken = await TestUtils.generateAuthToken();
});


describe('Schema validation', () => {
  it('should return 401 if user is not authenticated', async () => {
    const response = await request(app).get(route);

    expect(response.status).toBe(401);
  }); 
});

it('should call usecase with correct params and return trends', async () => {
  jest.spyOn(usecase, 'execute').mockResolvedValue({} as FetchDailyTrendsUseCaseOutput);

  const response = await request(app)
    .get(route)
    .set('Authorization', authToken);


  expect(response.status).toBe(200);
  
  expect(usecase.execute).toHaveBeenCalled();
  expect(response.body).toHaveProperty('result');
});