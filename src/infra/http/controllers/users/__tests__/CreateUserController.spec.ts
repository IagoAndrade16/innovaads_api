import request from 'supertest';
import { find } from '../../../../../core/DependencyInjection';
import { app } from '../../../../../infra/app';
import { CreateUserUseCase } from '../../../../../domain/modules/users/usecases/CreateUserUseCase';

const route = '/users';
const usecase = find(CreateUserUseCase);

describe('Schema Validation', () => {
  it('should validate required params', async () => {
    const res = await request(app).post(route).send({});
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('password');
    expect(res.body).toHaveProperty('phone');
  })
})

it('should call usecase', async () => {
  jest.spyOn(usecase, 'execute').mockResolvedValue();

  const res = await request(app).post(route).send({
    name: 'John Doe',
    email: 'test@email.com',
    password: '123456',
    phone: '123456789'
  });  

  expect(res.status).toBe(201);

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'test@email.com',
    password: '123456',
    phone: '123456789'
  });
})