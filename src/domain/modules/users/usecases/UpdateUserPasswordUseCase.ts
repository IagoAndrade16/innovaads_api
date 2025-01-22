import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { HashProvider, hashProviderAlias } from "../../../../providers/hash/HashProvider";
import { UniqueEntityID } from "../../../entities/UniqueEntityID";
import { DomainError } from "../../../errors/DomainError";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";
import { UsersRepository, usersRepositoryAlias } from "../repositories/UsersRepository";

export type UpdateUserPasswordUseCaseInput = {
  userId: UniqueEntityID;
  actualPassword: string;
  newPassword: string;
}

@singleton()
export class UpdateUserPasswordUseCase implements UseCase<UpdateUserPasswordUseCaseInput, void> {
  constructor (
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(hashProviderAlias)
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(input: UpdateUserPasswordUseCaseInput): Promise<void> {
    const user = await this.usersRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const actualPasswordMatch = await this.hashProvider.compareHash(input.actualPassword, user.password);

    if (!actualPasswordMatch) {
      throw new DomainError(400, 'INVALID_PASSWORD');
    }

    const newPasswordHash = await this.hashProvider.generateHash(input.newPassword);

    await this.usersRepository.updateById(user.id, {
      password: newPasswordHash,
    })
  }
}