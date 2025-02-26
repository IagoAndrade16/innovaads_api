import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";
import { FacebookCredential } from "../entities/FacebookCredential";
import { FacebookCredentialsRepository, facebookCredentialsRepositoryAlias } from "../repositories/FacebookCredetialsRepository";
import { UsersRepository, usersRepositoryAlias } from "../repositories/UsersRepository";

export type ConnectFacebookAccountUseCaseInput = {
  userId: string;
  userIdOnFacebook: string;
  accessToken: string;
  expiresIn: number;
}

export type ConnectFacebookAccountUseCaseOutput = {
  facebookCredential: FacebookCredential;
};

@singleton()
export class ConnectFacebookAccountUseCase implements UseCase<ConnectFacebookAccountUseCaseInput, ConnectFacebookAccountUseCaseOutput> {
  constructor(
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(facebookCredentialsRepositoryAlias)
    private readonly facebookCredentialsRepository: FacebookCredentialsRepository,
  ) {}

  async execute(input: ConnectFacebookAccountUseCaseInput): Promise<ConnectFacebookAccountUseCaseOutput> {
    const user = await this.usersRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const expiresIn = FacebookCredential.generateExpirationDate(input.expiresIn);
    const savedCredential = await this.facebookCredentialsRepository.save({
      accessToken: input.accessToken,
      expiresIn,
      userId: input.userId,
      userIdOnFacebook: input.userIdOnFacebook,
    })

    return {
      facebookCredential: savedCredential,
    }
  }
}