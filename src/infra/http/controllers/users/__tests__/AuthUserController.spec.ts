import request from 'supertest';

import { app } from "../../../../../infra/app";
import { find } from '../../../../../core/DependencyInjection';
import { v4 as uuidv4 } from 'uuid';
import { AuthUserUseCase } from '../../../../../domain/modules/users/usecases/AuthUserUseCase';

const route = '/users/auth';
const usecase = find(AuthUserUseCase);

describe('Schema validation', () => {
  it('should validate required params', async () => {
    const response = await request(app).post(route).send({});

    expect(response.status).toBe(401);
  })
});


it('should call usecase with correct params', async () => {
  const mockedUsecaseRes = {
    auth: {
      token: uuidv4(),
    },
    name: 'Test User',
    email: 'email@email.com',
    phone: '123456',
  }
  
  jest.spyOn(usecase, 'execute').mockResolvedValue({ 
    ...mockedUsecaseRes
  });

  const response = await request(app)
    .post(route)
    .send()
    .set('Authorization', `Basic ${btoa(`${'test@email.com'}:${'123456'}`)}`);

  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    ...mockedUsecaseRes,
  });

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    email: 'test@email.com',
    password: '123456',
  });
});