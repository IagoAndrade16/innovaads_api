import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { UsersRepository, usersRepositoryAlias } from "../repositories/UsersRepository";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";
import { GoogleCredentialsRepository, googleCredentialsRepositoryAlias } from "../repositories/GoogleCredentialsRepository";

type DisconnectGoogleAccountUseCaseInput = {
  userId: string;
}

@singleton()
export class DisconnectGoogleAccountUseCase implements UseCase<DisconnectGoogleAccountUseCaseInput, void> {
  constructor (
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(googleCredentialsRepositoryAlias)
    private readonly googleCredentialsRepository: GoogleCredentialsRepository,
  ) {}

  async execute(input: DisconnectGoogleAccountUseCaseInput): Promise<void> {
    const user = await this.usersRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    await this.googleCredentialsRepository.deleteByUserId(user.id);
  }
}