import { DomainError } from "./DomainError";

export class UserNotFound extends DomainError {
  constructor() {
    super(400, "USER_NOT_FOUND");
  }
}