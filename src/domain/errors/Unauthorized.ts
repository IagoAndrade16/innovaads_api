import { DomainError } from "./DomainError";

export class UnauthorizedError extends DomainError {
  constructor(message: string) {
    super(401, message ?? "UNAUTHORIZED");
  }
}