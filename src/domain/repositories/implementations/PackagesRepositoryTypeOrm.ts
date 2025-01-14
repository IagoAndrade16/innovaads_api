import { Database } from "../../../database/Database";
import { Package } from "../../packages/entities/Package";
import { PackageInsertInput } from "../@types/packages";
import { PackagesRepository } from "../PackagesRepository";


export class PackagesRespositoryTypeOrm implements PackagesRepository {
  private repository = Database.source.getRepository(Package);

  async insert(data: PackageInsertInput): Promise<Package> {
    const packageCreated = this.repository.create(data);
    await this.repository.save(packageCreated);
    return packageCreated;
  }
}