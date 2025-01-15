import { Database } from "../../../../database/Database";
import { Package } from "../../entities/Package";
import { PackageDetails } from "../../entities/PackageDetails";
import { PackageInsertInput } from "../@types/packages";
import { PackagesRepository } from "../PackagesRepository";


export class PackagesRespositoryTypeOrm implements PackagesRepository {
  private repository = Database.source.getRepository(Package);

  async insert(data: PackageInsertInput): Promise<Package> {
    const packageCreated = this.repository.create(data);

    if (data.details) {
      packageCreated.details = data.details.map(detail => 
        this.repository.manager.create(PackageDetails, {
          ...detail,
          packageId: packageCreated.id,
        })
      );
    }

    await this.repository.save(packageCreated);
    return packageCreated;
  }

  async findById(id: string): Promise<Package | null> {
    return this.repository.findOneBy({ id });
  }
}