import { PackageDetails } from "../packages/entities/PackageDetails";
import { PackageDetailsInput } from "./@types/packageDetails";

export type PackageDetailsRepository = {
  insert(data: PackageDetailsInput): Promise<PackageDetails>;
}

export const packageDetailsRepositoryAlias = 'PackageDetailsRepository' as const;