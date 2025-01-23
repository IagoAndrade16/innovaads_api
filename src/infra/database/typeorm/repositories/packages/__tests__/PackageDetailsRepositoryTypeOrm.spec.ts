import { find } from "../../../../../../core/DependencyInjection";
import { Database } from "../../../../Database";

import { Package } from "../../../../../../domain/modules/packages/entities/Package";
import { PackageDetails } from "../../../../../../domain/modules/packages/entities/PackageDetails";
import { PackageDetailsInput } from "../../../../../../domain/modules/packages/repositories/@types/packageDetails";
import { PackageInsertInput } from "../../../../../../domain/modules/packages/repositories/@types/packages";
import { PackageDetailsRepository, packageDetailsRepositoryAlias } from "../../../../../../domain/modules/packages/repositories/PackageDetailsRepository";
import { PackagesRepository, packagesRepositoryAlias } from "../../../../../../domain/modules/packages/repositories/PackagesRepository";

const packageDetailsRepository = find<PackageDetailsRepository>(packageDetailsRepositoryAlias);
const packagesRepository = find<PackagesRepository>(packagesRepositoryAlias);

const deletePackageDetails = async (detailsIds: string[]) => {
  const deletePromises = detailsIds.map((id: string) => Database.source.getRepository(PackageDetails).delete({ id }));
  await Promise.all(deletePromises);
};

beforeAll(async () => {
  await Database.initialize();
});

afterAll(async () => {
  await Database.close();
});

const packageDetailsMockInput: PackageDetailsInput = {
  description: 'Test Package Detail',
  packageId: 'packageId',
} 

const packageMockInput: PackageInsertInput = {
  description: 'Test Package',
  price: 100,
  name: 'Test Package',
}

describe('insert', () => {
  it('should insert a package detail', async () => {
    const packageDetailsInsert = await packageDetailsRepository.insert({
      ...packageDetailsMockInput,
    });

    await deletePackageDetails([packageDetailsInsert.id.toString()]);

    expect(packageDetailsInsert).toMatchObject({
      id: expect.any(String),
      description: 'Test Package Detail',
      packageId: 'packageId',
      deleted: false,
      deletedAt: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});

describe('findById', () => {
  it('should find a package detail by id', async () => {
    const packageDetailsInsert = await packageDetailsRepository.insert({
      ...packageDetailsMockInput,
    });

    const packageDetailsFound = await packageDetailsRepository.findBydId(packageDetailsInsert.id.toString());

    await deletePackageDetails([packageDetailsInsert.id.toString()]);

    expect(packageDetailsFound).not.toBeNull();
    expect(packageDetailsFound).toMatchObject({
      id: expect.any(String),
      description: 'Test Package Detail',
      packageId: 'packageId',
      deleted: false,
      deletedAt: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should return null if package detail is not found', async () => {
    const packageDetailsInsert = await packageDetailsRepository.insert({
      ...packageDetailsMockInput,
    });

    const packageDetailsFound = await packageDetailsRepository.findBydId('invalid-id');

    await deletePackageDetails([packageDetailsInsert.id.toString()]);

    expect(packageDetailsFound).toBeNull();
  });
});

describe('findByPackageId', () => {
  it('should find a package detail by package id', async () => {
    const packageInserted = await packagesRepository.insert({
      ...packageMockInput,
    })

    const packageDetailsInsert = await packageDetailsRepository.insert({
      ...packageDetailsMockInput,
      packageId: packageInserted.id,
    });

    const packageDetailsFound = await packageDetailsRepository.findByPackageId(packageInserted.id);

    await deletePackageDetails([packageDetailsInsert.id.toString()]);
    await Database.source.getRepository(Package).delete({ id: packageInserted.id });

    expect(packageDetailsFound).not.toBeNull();
    expect(packageDetailsFound).toHaveLength(1);

    expect(packageDetailsFound[0]).toMatchObject({
      id: expect.any(String),
      description: 'Test Package Detail',
      packageId: packageInserted.id,
      deleted: false,
      deletedAt: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should return empty array if package detail is not found', async () => {
    const packageInserted = await packagesRepository.insert({
      ...packageMockInput,
    })

    const packageDetailsInsert = await packageDetailsRepository.insert({
      ...packageDetailsMockInput,
      packageId: packageInserted.id,
    });

    const packageDetailsFound = await packageDetailsRepository.findByPackageId('invalid-id');

    await deletePackageDetails([packageDetailsInsert.id.toString()]);
    await Database.source.getRepository(Package).delete({ id: packageInserted.id });
    
    expect(packageDetailsFound).not.toBeNull();
    expect(packageDetailsFound).toHaveLength(0);
  });
})