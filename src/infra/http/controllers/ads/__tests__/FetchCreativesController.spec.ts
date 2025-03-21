import request from 'supertest';

import { TestUtils } from '../../../../../../tests/utils/TestUtils';
import { find } from '../../../../../core/DependencyInjection';
import { FetchCreativesUseCase } from '../../../../../domain/modules/ads/usecases/FetchCreativesUseCase';
import { app } from "../../../../../infra/app";
import { UsersRepository, usersRepositoryAlias } from '../../../../../domain/modules/users/repositories/UsersRepository';
import { User } from '../../../../../domain/modules/users/entities/User';
import { AdActiveStatus } from '../../../../../providers/facebook/@types/FacebookGraphApiAdsTypes';

const route = '/ads/creatives/fetch';
const usecase = find(FetchCreativesUseCase);

const usersRepo = find<UsersRepository>(usersRepositoryAlias);

let authToken: string;

beforeEach(async () => {
  authToken = await TestUtils.generateAuthToken();
})

describe('Schema validation', () => {
  it('should return 401 if token is not provided', async () => {
    const response = await request(app).post(route).send({});

    expect(response.status).toBe(401);
  });

  it('should require necessary parameters', async () => {
    jest.spyOn(usersRepo, 'findById').mockResolvedValue({ 
      id: 'user-id',
      needsToBuyPlan: () => false,
    } as unknown as User);

    const response = await request(app)
      .post(route)
      .set('Authorization', authToken)
      .send();
  
    expect(response.status).toBe(400);
    expect(response.body['filters.ad_reached_countries']).toBeDefined()
    expect(response.body['filters.search_terms']).toBeDefined()
    expect(response.body['filters.ad_active_status']).toBeUndefined()
    expect(response.body.nextRequestUrl).toBeUndefined()
  });

  describe('filters.ad_active_status', () => {
    it('should return 400 if invalid value is provided', async () => {
      jest.spyOn(usersRepo, 'findById').mockResolvedValue({ 
        id: 'user-id',
        needsToBuyPlan: () => false,
      } as unknown as User);
  
      const response = await request(app)
        .post(route)
        .set('Authorization', authToken)
        .send( {
          filters: {
            ad_active_status: 'INVALID_STATUS',
          },
        });
    
      expect(response.status).toBe(400);
      expect(response.body['filters.ad_active_status']).toBeDefined()
    })
  })
});


it('should call usecase with correct params', async () => {
  jest.spyOn(usersRepo, 'findById').mockResolvedValue({ 
    id: 'user-id',
    needsToBuyPlan: () => false,
  } as unknown as User);
  const mockedUsecaseRes = {
    creatives: [],
    paging: {
      cursors: {
        before: 'before_cursor',
        after: 'after_cursor',
      },
    }
  };
  
  jest.spyOn(usecase, 'execute').mockResolvedValue(mockedUsecaseRes);

  const input = {
    filters: {
      ad_reached_countries: 'BR',
      search_terms: 'test',
      ad_active_status: AdActiveStatus.ACTIVE,
    },
    nextRequestUrl: undefined,
  }
  const response = await request(app)
    .post(route)
    .set('Authorization', authToken)
    .send(input);

  expect(response.status).toBe(200);
  expect(response.body).toMatchObject(mockedUsecaseRes);

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    userId: expect.any(String),
    filters: input.filters,
    fields: {},
    nextRequestUrl: input.nextRequestUrl,
  });
});