import { Package } from "../../../../domain/modules/packages/entities/Package";

export class TypeOrmPackagesMapper {
  static toHTTP(input: Package) {
    return {
      name: input.name,
      description: input.description,
      id: input.id,
      price: input.price,
      details: input.details.map(detail => ({
        id: detail.id,
        description: detail.description,
      }))
    }
  }
}