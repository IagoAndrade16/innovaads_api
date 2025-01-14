import { Database } from "../../../database/Database";
import { PackageDetails } from "../../packages/entities/PackageDetails";
import { PackageDetailsInput } from "../@types/packageDetails";
import { PackageDetailsRepository } from "../PackageDetailsRepository";


export class PackageDetailsRespositoryTypeOrm implements PackageDetailsRepository {
  private repository = Database.source.getRepository(PackageDetails);

  async insert(data: PackageDetailsInput): Promise<PackageDetails> {
    const packageDetail = this.repository.create(data);
    await this.repository.save(packageDetail);
    return packageDetail;
  }
}