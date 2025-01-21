
import { Database } from "../../../Database";
import { PackageDetails } from "../../../../../domain/modules/packages/entities/PackageDetails";
import { PackageDetailsInput } from "../../../../../domain/modules/packages/repositories/@types/packageDetails";
import { PackageDetailsRepository } from "../../../../../domain/modules/packages/repositories/PackageDetailsRepository";


export class PackageDetailsRespositoryTypeOrm implements PackageDetailsRepository {
  private repository = Database.source.getRepository(PackageDetails);

  async insert(data: PackageDetailsInput): Promise<PackageDetails> {
    const packageDetail = this.repository.create(data);
    await this.repository.save(packageDetail);
    return packageDetail;
  }

  async findBydId(id: string): Promise<PackageDetails | null> {
    return this.repository.findOneBy({ id });
  }

  async findByPackageId(packageId: string, onlyNotDeleted: boolean = true): Promise<PackageDetails[]> {
    return this.repository.find({ 
      where: { 
        packageId,
        deleted: !onlyNotDeleted,
      } 
    });
  }
}