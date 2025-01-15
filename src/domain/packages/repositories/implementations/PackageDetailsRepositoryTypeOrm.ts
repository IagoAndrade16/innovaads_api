import { Database } from "../../../../database/Database";
import { PackageDetails } from "../../entities/PackageDetails";
import { PackageDetailsInput } from "../@types/packageDetails";
import { PackageDetailsRepository } from "../PackageDetailsRepository";


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