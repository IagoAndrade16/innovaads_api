import request from 'supertest';
import { TestUtils } from '../../../../../../tests/utils/TestUtils';
import { find } from '../../../../../core/DependencyInjection';
import { GetUserBillingSummaryUseCase } from '../../../../../domain/modules/users/usecases/GetUserBillingSummaryUseCase';
import { app } from '../../../../../infra/app';
import { DomainDates } from '../../../../../core/DomainDates';
import { UsersRepository, usersRepositoryAlias } from '../../../../../domain/modules/users/repositories/UsersRepository';
import { User } from '../../../../../domain/modules/users/entities/User';

const route = '/packages/subscriptions';
const usecase = find(GetUserBillingSummaryUseCase);

const usersRepo = find<UsersRepository>(usersRepositoryAlias);

let authToken: string;

beforeEach(async () => {
  authToken = await TestUtils.generateAuthToken();
})

describe('Schema Validation', () => {
  it('should validate required params', async () => {
    jest.spyOn(usersRepo, 'findById').mockResolvedValue({
      id: '-1',
    } as User);
    const res = await request(app)
      .get(route)
      .set('Authorization', authToken)
      .send();
    
    expect(res.status).toBe(400);
  })
})

it('should call usecase', async () => {
  jest.spyOn(usecase, 'execute').mockResolvedValue({
    package: {
      description: 'Package Description',
      details: [],
      id: 'package-id',
      name: 'Package Name',
      price: 10,
    },
    subscription: {
      status: 'active',
      card: {
        brand: 'Visa',
        firstSixDigits: '123456',
        lastFourDigits: '7890',
      },
      nextBillingAt: DomainDates.format(new Date(), 'DD/MM/YYYY'),
    }
  });

  const res = await request(app)
    .get(route)
    .set('Authorization', authToken)
    .send();  
  
  expect(res.status).toBe(200);

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    userId: '-1'
  });
})