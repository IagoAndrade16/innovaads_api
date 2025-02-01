import request from "supertest";
import { app } from "../../../../app";
import { find } from "../../../../../core/DependencyInjection";
import { UpdateForgotUserPasswordUseCase } from "../../../../../domain/modules/users/usecases/UpdateForgotUserPasswordUseCase";

const route = '/users/2fa/forgot-password/reset';
const usecase = find<UpdateForgotUserPasswordUseCase>(UpdateForgotUserPasswordUseCase);

describe('Schema validation', () => {
  it('should return 400 if required params was not provided', async () => {
    const response = await request(app).post(route);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('newPassword');
  });
});


it('should call usecase and return 204 on success', async () => {
  jest.spyOn(usecase, 'execute').mockResolvedValueOnce();

  const response = await request(app).post(route).send({
    email: 'abc@email.com',
    newPassword: '123456',
  });

  expect(response.status).toBe(204);

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    email: 'abc@email.com',
    newPassword: '123456',
  });
});