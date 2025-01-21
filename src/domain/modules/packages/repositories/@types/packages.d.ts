export type PackageInsertInput = {
  name: string;
  description: string;
  price: number;
  details?: {
    description: string;
    packageId?: string;
  }[];
}
