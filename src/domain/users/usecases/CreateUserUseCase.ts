import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../core/UseCase";
import { UsersRepository, usersRepositoryAlias } from "../repositories/UsersRepository";
import { HashProvider, hashProviderAlias } from "../../../providers/hash/HashProvider";
import { DomainError } from "../../../infra/errors/DomainError";

export type CreateUserUseCaseInput = {
  name: string;
  email: string;
  password: string;
  phone: string;
}

@singleton()
export class CreateUserUseCase implements UseCase<CreateUserUseCaseInput, void> {
  constructor (
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(hashProviderAlias)
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(input: CreateUserUseCaseInput): Promise<void> {
    const user = await this.usersRepository.findByEmail(input.email);

    if (user) {
      throw new DomainError(400, 'USER_ALREADY_EXISTS');
    }

    const passwordHashed = await this.hashProvider.generateHash(input.password);

    await this.usersRepository.insert({
      email: input.email,
      name: input.name,
      password: passwordHashed,
      phone: input.phone,
    })
  }
}