import { DomainError } from "./DomainError";

export class UserNotFoundError extends DomainError {
  constructor() {
    super(400, "USER_NOT_FOUND");
  }
}