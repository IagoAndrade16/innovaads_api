import { Package } from "../entities/Package";
import { ListPackagesInput, PackageInsertInput } from "./@types/packages";

export type PackagesRepository = {
  insert(data: PackageInsertInput): Promise<Package>;
  findById(id: string): Promise<Package | null>;
  list(input: ListPackagesInput): Promise<Package[]>;
}

export const packagesRepositoryAlias = 'PackagesRepository' as const;