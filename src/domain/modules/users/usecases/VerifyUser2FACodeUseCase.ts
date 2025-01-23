import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { UsersRepository, usersRepositoryAlias } from "../repositories/UsersRepository";
import { Users2FARepository, users2FARepositoryAlias } from "../repositories/Users2FARepository";

import { DomainError } from "../../../errors/DomainError";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";

export type VerifyUser2FACodeUseCaseInput = {
  code: string;
  userId: string;
}

@singleton()
export class VerifyUser2FACodeUseCase implements UseCase<VerifyUser2FACodeUseCaseInput, void> {
  constructor(
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(users2FARepositoryAlias)
    private readonly users2FARepository: Users2FARepository,
  ) {}

  async execute(input: VerifyUser2FACodeUseCaseInput): Promise<void> {
    const user = await this.usersRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const user2FACode = await this.users2FARepository.findLastCodeByUserId(user.id);

    if (!user2FACode) {
      throw new DomainError(400, 'CODE_NOT_FOUND');
    }

    if (user2FACode.code !== input.code) {
      throw new DomainError(400, 'INVALID_CODE');
    }

    await this.users2FARepository.updateById(user2FACode.id, { alreadyUsed: true });
  }
}