import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { usersForgotPassword2FARepositoryAlias, UsersForgotPassword2FARepository } from "../repositories/UsersForgotPassword2FARepository";
import { DomainError } from "../../../errors/DomainError";
import { UsersRepository, usersRepositoryAlias } from "../repositories/UsersRepository";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";

export type VerifyUserForgotPassword2FaUseCaseInput = {
  code: string;
  email: string;
}

@singleton()
export class VerifyUserForgotPassword2FaUseCase implements UseCase<VerifyUserForgotPassword2FaUseCaseInput, void> {
  constructor (
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(usersForgotPassword2FARepositoryAlias)
    private readonly userForgotPassword2FARepository: UsersForgotPassword2FARepository,
  ) {}

  async execute(input: VerifyUserForgotPassword2FaUseCaseInput): Promise<void> {
    const user = await this.usersRepository.findByEmail(input.email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const codeSent = await this.userForgotPassword2FARepository.findLastByEmail(input.email);

    if (!codeSent) {
      throw new DomainError(400, 'CODE_NOT_FOUND');
    }

    if (codeSent.alreadyUsed) {
      throw new DomainError(400, 'INVALID_CODE');
    }

    if (codeSent.code !== input.code) {
      throw new DomainError(400, 'INVALID_CODE');
    }

    await this.userForgotPassword2FARepository.updateById(codeSent.id, {
      alreadyUsed: true,
    });
  }
}