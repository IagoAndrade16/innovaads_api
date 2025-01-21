import { ValueTransformer } from "typeorm";
import { UniqueEntityID } from "../../../../domain/entities/UniqueEntityID";


export const typeormIdTransformer: ValueTransformer | ValueTransformer[] = {
  to: (id: UniqueEntityID) => {
    return id.toString();
  },
  from: (id: UniqueEntityID | string) => {
    if(id instanceof UniqueEntityID) {
      return id;
    }

    return new UniqueEntityID(id);
  },
}