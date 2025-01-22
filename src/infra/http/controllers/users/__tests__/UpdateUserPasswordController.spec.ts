import request from 'supertest';
import { TestUtils } from '../../../../../../tests/utils/TestUtils';
import { find } from '../../../../../core/DependencyInjection';
import { UniqueEntityID } from '../../../../../domain/entities/UniqueEntityID';
import { UpdateUserPasswordUseCase } from '../../../../../domain/modules/users/usecases/UpdateUserPasswordUseCase';
import { app } from '../../../../../infra/app';

const route = '/users/password';
const usecase = find(UpdateUserPasswordUseCase);

let authToken: string;

beforeAll(async () => {
  authToken = await TestUtils.generateAuthToken(-1);
})

describe('Schema validation', () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).patch(route)
    .send({});

    expect(res.status).toBe(401);
  })


  it('should require necessary parameters', async () => {
    const res = await request(app).patch(route)
    .set('Authorization', `${authToken}`)
    .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('actualPassword');
    expect(res.body).toHaveProperty('newPassword');
  })

})

it('should call usecase and return 204', async () => {
  jest.spyOn(usecase, 'execute').mockResolvedValue();

  const res = await request(app).patch(route)
  .set('Authorization', `${authToken}`)
  .send({
    actualPassword: '123456',
    newPassword: '1234567',
  });  

  expect(res.status).toBe(204);

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    actualPassword: '123456',
    newPassword: '1234567',
    userId: new UniqueEntityID('-1'),
  });
})