import { find } from "../../../../core/DependencyInjection";
import { Database } from "../../../../database/Database";
import { Package } from "../../entities/Package";
import { PackageDetails } from "../../entities/PackageDetails";
import { PackageInsertInput } from "../@types/packages";
import { PackagesRepository, packagesRepositoryAlias } from "../PackagesRepository";

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


    await deletePackageById(packageInsert.id);
    
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

    await deletePackageById(packageInsert.id);
    await deletePackageDetails(packageInsert.details.map(detail => detail.id));

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

    const packageFound = await packagesRepository.findById(packageInsert.id);    

    await deletePackageById(packageInsert.id);

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

    await deletePackageById(packageInsert.id);

    expect(packageFound).toBeNull();
  });
})

afterAll(async () => {
  await Database.close();
});