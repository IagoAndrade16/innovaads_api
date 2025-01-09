import request from 'supertest';

import { app } from "../../../../infra/app";
import { find } from '../../../../core/DependencyInjection';
import { AuthUserUseCase } from '../../usecases/AuthUserUseCase';
import { describe, expect, it, vi } from 'vitest';
import { v4 as uuidv4 } from 'uuid';

const route = '/users/auth';
const usecase = find(AuthUserUseCase);

describe('Schema validation', () => {
  it('should validate required params', async () => {
    const response = await request(app).post(route).send({});

    expect(response.status).toBe(401);
  })
});


it('should call usecase with correct params', async () => {
  vi.spyOn(usecase, 'execute').mockResolvedValue({ token: uuidv4() });

  const response = await request(app)
    .post(route)
    .send()
    .set('Authorization', `Basic ${btoa(`${'test@email.com'}:${'123456'}`)}`);

  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    token: expect.any(String),
  });

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    email: 'test@email.com',
    password: '123456',
  });
});