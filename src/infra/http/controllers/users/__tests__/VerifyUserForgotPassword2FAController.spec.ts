import request from "supertest";
import { app } from "../../../../app";
import { find } from "../../../../../core/DependencyInjection";
import { VerifyUserForgotPassword2FaUseCase } from "../../../../../domain/modules/users/usecases/VerifyUserForgotPassoword2FaUseCase";



const route = '/users/2fa/forgot-password/verify';
const usecase = find<VerifyUserForgotPassword2FaUseCase>(VerifyUserForgotPassword2FaUseCase);

describe('Schema validation', () => {
  it('should return 400 if required params was not provided', async () => {
    const response = await request(app).post(route);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('code');
    expect(response.body).toHaveProperty('email');
  });
});

it('should call usecase and return 204 on success', async () => {
  jest.spyOn(usecase, 'execute').mockResolvedValueOnce();

  const response = await request(app).post(route).send({
    code: '123456',
    email: 'abc@email.com',
  });

  expect(response.status).toBe(204);

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith({
    code: '123456',
    email: 'abc@email.com',
  });  
});