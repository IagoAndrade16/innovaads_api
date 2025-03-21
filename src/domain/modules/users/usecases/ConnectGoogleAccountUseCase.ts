import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { UsersRepository, usersRepositoryAlias } from "../repositories/UsersRepository";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";
import { GoogleAuthProvider, googleAuthProviderAlias } from "../../../../providers/google/GoogleAuthProvider";
import { DomainError } from "../../../errors/DomainError";
import { GoogleCredential } from "../entities/GoogleCredential";
import { GoogleCredentialsRepository, googleCredentialsRepositoryAlias } from "../repositories/GoogleCredentialsRepository";

type ConnectGoogleAccountUseCaseInput = {
  code: string;
  userId: string;
}

export type ConnectGoogleAccountUseCaseOutput = {
  googleCredential: GoogleCredential;
};

@singleton()
export class ConnectGoogleAccountUseCase implements UseCase<ConnectGoogleAccountUseCaseInput, ConnectGoogleAccountUseCaseOutput> {
  constructor (
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(googleAuthProviderAlias)
    private readonly googleAuthProvider: GoogleAuthProvider,

    @inject(googleCredentialsRepositoryAlias)
    private readonly googleCredentialsRepository: GoogleCredentialsRepository,
  ) {}

  async execute(input: ConnectGoogleAccountUseCaseInput): Promise<ConnectGoogleAccountUseCaseOutput> {
    const user = await this.usersRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const googleCredentials = await this.googleAuthProvider.getAuthToken({
      code: input.code,
    });

    if (googleCredentials.status === 'BAD_REQUEST') {
      throw new DomainError(400, 'FAILED_TO_CONNECT_ACCOUNT');
    }

    const expiresIn = GoogleCredential.generateExpirationDate(googleCredentials.data!.expires_in);
    const expiresRefreshIn = GoogleCredential.generateExpirationDate(googleCredentials.data!.refresh_token_expires_in);

    const savedCredential = await this.googleCredentialsRepository.insert({
      accessToken: googleCredentials.data!.access_token,
      refreshToken: googleCredentials.data!.refresh_token,
      expiresIn,
      expiresRefreshIn,
      userId: user.id,
    });

    return {
      googleCredential: savedCredential,
    }
  }
}