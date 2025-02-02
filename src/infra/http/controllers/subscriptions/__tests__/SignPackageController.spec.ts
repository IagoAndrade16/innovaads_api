import request from 'supertest';
import { find } from '../../../../../core/DependencyInjection';
import { app } from '../../../../../infra/app';
import { SignPackageUseCase } from '../../../../../domain/modules/subscriptions/usecases/SignPackageUseCase';
import { TestUtils } from '../../../../../../tests/utils/TestUtils';

const route = '/packages/subscriptions';
const usecase = find(SignPackageUseCase);

let authToken: string;

beforeEach(async () => {
  authToken = await TestUtils.generateAuthToken();
})

describe('Schema Validation', () => {
  it('should validate required params', async () => {
    const res = await request(app)
      .post(route)
      .set('Authorization', authToken)
      .send({});
    
    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty('packageId');
    expect(res.body['payerData.document']).toBeDefined();

    expect(res.body['paymentData.number']).toBeDefined();
    expect(res.body['paymentData.holderName']).toBeDefined();
    expect(res.body['paymentData.expMonth']).toBeDefined();
    expect(res.body['paymentData.expYear']).toBeDefined();
    expect(res.body['paymentData.cvv']).toBeDefined();

    expect(res.body['paymentData.billingAddress.zipCode']).toBeDefined();
    expect(res.body['paymentData.billingAddress.street']).toBeDefined();
    expect(res.body['paymentData.billingAddress.number']).toBeDefined();
    expect(res.body['paymentData.billingAddress.neighborhood']).toBeDefined();
    expect(res.body['paymentData.billingAddress.city']).toBeDefined();
    expect(res.body['paymentData.billingAddress.state']).toBeDefined();
    expect(res.body['paymentData.billingAddress.country']).toBeDefined();
    expect(res.body['paymentData.billingAddress.complement']).toBeUndefined();
    
  })
})

it('should call usecase', async () => {
  jest.spyOn(usecase, 'execute').mockResolvedValue();

  const mockedUsecaseInput = {
    packageId: 'package-id',
    payerData: {
      document: TestUtils.validCpf
    },
    paymentData: {
      number: '1234567890123456',
      holderName: 'John Doe',
      expMonth: '12',
      expYear: '2023',
      cvv: '123',
      billingAddress: {
        zipCode: '12345678',
        street: 'Rua Teste',
        number: '123',
        neighborhood: 'Bairro Teste',
        city: 'Cidade Teste',
        state: 'Estado Teste',
        country: 'País Teste',
      }
    }
  }

  const res = await request(app)
    .post(route)
    .set('Authorization', authToken)
    .send({
      ...mockedUsecaseInput,
  });  
  
  expect(res.status).toBe(201);

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    ...mockedUsecaseInput,
    userId: '-1'
  });
})