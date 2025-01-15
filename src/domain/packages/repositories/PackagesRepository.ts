import { Package } from "../entities/Package";
import { PackageInsertInput } from "./@types/packages";

export type PackagesRepository = {
  insert(data: PackageInsertInput): Promise<Package>;
  findById(id: string): Promise<Package | null>;
}

export const packagesRepositoryAlias = 'PackagesRepository' as const;