import request from 'supertest';
import { find } from '../../../../../core/DependencyInjection';
import { ListPackagesUseCase } from '../../../../../domain/modules/packages/usecases/ListPackagesUseCase';
import { app } from '../../../../../infra/app';

const route = '/packages';
const usecase = find(ListPackagesUseCase);

it('should call usecase', async () => {
  jest.spyOn(usecase, 'execute').mockResolvedValue({
    packages: []
  });

  const res = await request(app).get(route).send();  

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('packages');
  expect(res.body.packages).toHaveLength(0);

  expect(usecase.execute).toHaveBeenCalledTimes(1);
  expect(usecase.execute).toHaveBeenCalledWith();
})