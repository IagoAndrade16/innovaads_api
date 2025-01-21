import { DomainError } from "./DomainError";

export class ResourceNotFoundError extends DomainError {
  constructor(message?: string) {
    super(404, message ?? "RESOURCE_NOT_FOUND");
  }
}