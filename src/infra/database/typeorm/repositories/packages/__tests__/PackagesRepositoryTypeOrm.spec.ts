import { find } from "../../../../../../core/DependencyInjection";
import { Database } from "../../../../Database";

import { Package } from "../../../../../../domain/modules/packages/entities/Package";
import { PackageDetails } from "../../../../../../domain/modules/packages/entities/PackageDetails";
import { PackageInsertInput } from "../../../../../../domain/modules/packages/repositories/@types/packages";
import { PackagesRepository, packagesRepositoryAlias } from "../../../../../../domain/modules/packages/repositories/PackagesRepository";

const packagesRepository = find<PackagesRepository>(packagesRepositoryAlias);

beforeAll(async () => {
  await Database.initialize();
});

const deletePackageById = async (id: string) => {
  await Database.source.getRepository(Package).delete({ id })
}

const deletePackageDetails = async (detailsIds: string[]) => {
  const deletePromises = detailsIds.map((id: string) => Database.source.getRepository(PackageDetails).delete({ id }));
  await Promise.all(deletePromises);
}

const packageMockInputWithoutDetails: PackageInsertInput = {
  name: 'Test Package',
  description: 'Test Package Description',
  price: 100,
}

const packageMockInputWithDetails: PackageInsertInput = {
  name: 'Test Package',
  description: 'Test Package Description',
  price: 100,
  details: [
    {
      description: 'Test Package Detail',
    },
    {
      description: 'Test Package Detail 2',
    }
  ]
}

describe('insert', () => {
  it('should insert a package', async () => {
    const packageInsert = await packagesRepository.insert({
      ...packageMockInputWithoutDetails,
    });


    await deletePackageById(packageInsert.id.toString());
    
    expect(packageInsert).toMatchObject({
      id: expect.any(String),
      name: 'Test Package',
      description: 'Test Package Description',
      price: 100,
      deleted: false,
      deletedAt: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });  
  });

  it('should insert a package with details', async () => {
    const packageInsert = await packagesRepository.insert({
      ...packageMockInputWithDetails,
    });

    await deletePackageById(packageInsert.id.toString());
    await deletePackageDetails(packageInsert.details.map(detail => detail.id.toString()));

    expect(packageInsert).toMatchObject({
      id: expect.any(String),
      name: 'Test Package',
      description: 'Test Package Description',
      price: 100,
      deleted: false,
      deletedAt: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });  
  });
});

describe('findById', () => {
  it('should find a package by id', async () => {
    const packageInsert = await packagesRepository.insert({
      ...packageMockInputWithoutDetails,
    });

    const packageFound = await packagesRepository.findById(packageInsert.id.toString());    

    await deletePackageById(packageInsert.id.toString());

    expect(packageFound).not.toBeNull();
    expect(packageFound).toMatchObject({
      id: expect.any(String),
      name: 'Test Package',
      description: 'Test Package Description',
      price: 100,
      deleted: false,
      deletedAt: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });  
  });

  it('should return null if any package is found', async () => {
    const packageInsert = await packagesRepository.insert({
      ...packageMockInputWithoutDetails,
    });

    const packageFound = await packagesRepository.findById('invalid-id');

    await deletePackageById(packageInsert.id.toString());

    expect(packageFound).toBeNull();
  });
})

describe('list', () => {
  it('should list all packages', async () => {
    const packageInsert = await packagesRepository.insert({
      ...packageMockInputWithoutDetails,
    });

    const packages = await packagesRepository.list({});

    await deletePackageById(packageInsert.id.toString());

    expect(packages).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: packageInsert.id })
    ]))
  });
})

afterAll(async () => {
  await Database.close();
});