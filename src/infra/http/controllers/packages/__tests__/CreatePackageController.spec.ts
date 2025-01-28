import request from 'supertest';
import { find } from '../../../../../core/DependencyInjection';
import { CreatePackageUseCase } from '../../../../../domain/modules/packages/usecases/CreatePackageUseCase';
import { app } from '../../../../../infra/app';
import { Package } from '../../../../../domain/modules/packages/entities/Package';
import { UsersRepository, usersRepositoryAlias } from '../../../../../domain/modules/users/repositories/UsersRepository';
import { User } from '../../../../../domain/modules/users/entities/User';
import { TestUtils } from '../../../../../../tests/utils/TestUtils';
import { PackageDetails } from '../../../../../domain/modules/packages/entities/PackageDetails';

const route = '/packages';
const usecase = find(CreatePackageUseCase);

const usersRepo = find<UsersRepository>(usersRepositoryAlias)
let authToken: string;

beforeAll(async () => {
  authToken = await TestUtils.generateAuthToken(-1)
})

describe('Schema validation', () => {
  it('should return 401 if token is not provided', async () => {
    const res = await request(app)
      .post(route)
      .send({
        package: {
          name: 'package',
          description: 'description',
          price: 10
        },
        details: [{
          description: 'description'
        }]
      });  
  
    expect(res.status).toBe(401);
  })

  it('should return 403 if user has not permission', async () => {
    jest.spyOn(usersRepo, 'findById').mockResolvedValue({
      role: 'user'
    } as User);
    const token = await TestUtils.generateAuthToken(-1, false)
    const res = await request(app)
      .post(route)
      .set('Authorization', token)
      .send({
        package: {
          name: 'package',
          description: 'description',
          price: 10
        },
        details: [{
          description: 'description'
        }]
      });  
  
    expect(res.status).toBe(403);
  })

  it('should require necessary parameters', async () => {
    jest.spyOn(usersRepo, 'findById').mockResolvedValue({
      role: 'admin'
    } as User);

    const res = await request(app)
      .post(route)
      .set('Authorization', authToken)
      .send({});  
  
    expect(res.status).toBe(400);

    expect(res.body['package.name']).toBeDefined();
    expect(res.body['package.description']).toBeDefined();
    expect(res.body['package.price']).toBeDefined();

    expect(res.body['details']).toBeDefined();
  })
})

describe('CreatePackageController', () => {
  it('should call usecase', async () => {
    jest.spyOn(usersRepo, 'findById').mockResolvedValue({
      role: 'admin'
    } as User);
  
    jest.spyOn(usecase, 'execute').mockResolvedValue({
      package: {
        details: [] as PackageDetails[],
        id: 'id',
        createdAt: new Date()
      } as Package
    });
  
    const res = await request(app)
      .post(route)
      .set('Authorization', authToken)
      .send({
        package: {
          name: 'package',
          description: 'description',
          price: 10
        },
        details: [{
          description: 'description'
        }]
      });  
  
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('details');
    expect(res.body).toHaveProperty('id');
    expect(res.body).not.toHaveProperty('createdAt');
  
    expect(usecase.execute).toHaveBeenCalledTimes(1);
    expect(usecase.execute).toHaveBeenCalledWith({
      package: {
        name: 'package',
        description: 'description',
        price: 10
      },
      details: [{
        description: 'description'
      }],
      userId: expect.any(String)
    });
  })
})
