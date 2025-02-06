
import { Package } from "../../../../../domain/modules/packages/entities/Package";
import { PackageDetails } from "../../../../../domain/modules/packages/entities/PackageDetails";
import { PackageInsertInput } from "../../../../../domain/modules/packages/repositories/@types/packages";
import { PackagesRepository } from "../../../../../domain/modules/packages/repositories/PackagesRepository";
import { Database } from "../../../Database";


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

  async list(): Promise<Package[]> {
    return this.repository.find({
      relations: {
        details: true,
      }
    });
  }

  async findByIdWithDetails(id: string): Promise<Package | null> {
    return this.repository.findOne({
      where: { id }, 
      relations: {
        details: true,
      }
    });
  }
}