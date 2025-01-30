import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { UsersRepository, usersRepositoryAlias } from "../repositories/UsersRepository";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";
import { HashProvider, hashProviderAlias } from "../../../../providers/hash/HashProvider";

export type UpdateForgotUserPasswordUseCaseInput = {
  email: string;
  newPassword: string;
}

@singleton()
export class UpdateForgotUserPasswordUseCase implements UseCase<UpdateForgotUserPasswordUseCaseInput, void> {
  constructor (
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(hashProviderAlias)
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(input: UpdateForgotUserPasswordUseCaseInput): Promise<void> {
    const user = await this.usersRepository.findByEmail(input.email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const passwordHashed = await this.hashProvider.generateHash(input.newPassword);

    await this.usersRepository.updateById(user.id, {
      password: passwordHashed,
    });
  }
}