import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../core/UseCase";
import { UsersRepository, usersRepositoryAlias } from "../repositories/UsersRepository";
import { DomainError } from "../../../infra/errors/DomainError";
import { HashProvider, hashProviderAlias } from "../../../providers/hash/HashProvider";
import { User } from "../entities/User";

export type AuthUserUseCaseInput = {
  email: string;
  password: string;
}

export type AuthUserUseCaseOutput = {
  token: string;
}

@singleton()
export class AuthUserUseCase implements UseCase<AuthUserUseCaseInput, AuthUserUseCaseOutput> {
  constructor(
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(hashProviderAlias)
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(input: AuthUserUseCaseInput): Promise<AuthUserUseCaseOutput> {
    const user = await this.usersRepository.findByEmail(input.email);

    if (!user) {
      throw new DomainError(400, 'INVALID_CREDENTIALS');
    }

    const passwordMatch = await this.hashProvider.compareHash(input.password, user.password);

    if (!passwordMatch) {
      throw new DomainError(400, 'INVALID_CREDENTIALS');
    }

    const token = await User.generateUserToken({ id: user.id });

    return {
      token,
    }
  }
}