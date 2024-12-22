import request from 'supertest';

import { app } from "../../../../infra/app";
import { find } from '../../../../core/DependencyInjection';
import { AuthUserUseCase } from '../../usecases/AuthUserUseCase';
import { v4 as uuidv4 } from 'uuid';

const route = '/users/auth';
const usecase = find(AuthUserUseCase);

describe('Schema validation', () => {
  it('should validate required params', async () => {
    const response = await request(app).post(route).send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('password');
  })
});


it('should call usecase with correct params', async () => {
  jest.spyOn(usecase, 'execute').mockResolvedValue({ token: uuidv4() });

  const response = await request(app).post(route).send({
    email: 'test@email.com',
    password: '123456',
  });

  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    result: {
      token: expect.any(String),
    }
  });

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    email: 'test@email.com',
    password: '123456',
  });
});