import request from 'supertest';
import { find } from '../../../../../core/DependencyInjection';
import { app } from '../../../../../infra/app';
import { TestUtils } from '../../../../../../tests/utils/TestUtils';
import { UpdateUserUseCase } from '../../../../../domain/modules/users/usecases/UpdateUserUseCase';

const route = '/users';
const usecase = find(UpdateUserUseCase);

let authToken: string;

beforeAll(async () => {
  authToken = await TestUtils.generateAuthToken(-1);
})

describe('Schema validation', () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).put(route)
    .send({});

    expect(res.status).toBe(401);
  })

  describe('email', () => {
    it('should return 400 if email is not a valid email', async () => {
      const res = await request(app).put(route)
      .set('Authorization', `${authToken}`)
      .send({
        email: 'invalid-email',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('email');
    })
  })
  
  describe('phone', () => {
    it('should return 400 if phone is not valid', async () => {
      const res = await request(app).post(route).send({
        name: 'John Doe',
        password: '123456',
        phone: 'invalid-phone'
      });
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('phone');
    })
  })
})

it('should call usecase and return 204', async () => {
  jest.spyOn(usecase, 'execute').mockResolvedValue();

  const res = await request(app).put(route)
  .set('Authorization', `${authToken}`)
  .send({
    name: 'John Doe',
    email: 'test@email.com',
    phone: '24998179466'
  });  

  expect(res.status).toBe(204);

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'test@email.com',
    phone: '24998179466',
    userId: '-1',
  });
})