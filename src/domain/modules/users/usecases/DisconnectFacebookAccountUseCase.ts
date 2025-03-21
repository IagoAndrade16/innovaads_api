import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";
import { FacebookCredentialsRepository, facebookCredentialsRepositoryAlias } from "../repositories/FacebookCredetialsRepository";
import { UsersRepository, usersRepositoryAlias } from "../repositories/UsersRepository";

export type DisconnectFacebookAccountUseCaseInput = {
  userId: string;
}

export type DisconnectFacebookAccountUseCaseOutput = void;

@singleton()
export class DisconnectFacebookAccountUseCase implements UseCase<DisconnectFacebookAccountUseCaseInput, DisconnectFacebookAccountUseCaseOutput> {
  constructor(
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(facebookCredentialsRepositoryAlias)
    private readonly facebookCredentialsRepository: FacebookCredentialsRepository,
  ) {}

  async execute(input: DisconnectFacebookAccountUseCaseInput): Promise<DisconnectFacebookAccountUseCaseOutput> {
    const user = await this.usersRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    await this.facebookCredentialsRepository.deleteByUserId(input.userId);
  }
}