import { PackageDetails } from "../entities/PackageDetails";
import { PackageDetailsInput } from "./@types/packageDetails";

export type PackageDetailsRepository = {
  insert(data: PackageDetailsInput): Promise<PackageDetails>;
  findBydId(id: string): Promise<PackageDetails | null>;
  findByPackageId(packageId: string, onlyNotDeleted?: boolean): Promise<PackageDetails[]>;
}

export const packageDetailsRepositoryAlias = 'PackageDetailsRepository' as const;