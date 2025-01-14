import { Package } from "../packages/entities/Package";
import { PackageInsertInput } from "./@types/packages";

export type PackagesRepository = {
  insert(data: PackageInsertInput): Promise<Package>;
}

export const packagesRepositoryAlias = 'PackagesRepository' as const;