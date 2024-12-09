import { DomainError } from "./DomainError";

export class Unauthorized extends DomainError {
  constructor() {
    super(401, "UNAUTHORIZED");
  }
}