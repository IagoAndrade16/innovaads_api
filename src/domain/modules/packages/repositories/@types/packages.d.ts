/* eslint-disable @typescript-eslint/no-empty-object-type */
export type PackageInsertInput = {
  name: string;
  description: string;
  price: number;
  details?: {
    description: string;
    packageId?: string;
  }[];
}

export type ListPackagesInput = {}
