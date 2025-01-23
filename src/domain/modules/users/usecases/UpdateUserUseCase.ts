import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { UsersRepository, usersRepositoryAlias } from "../repositories/UsersRepository";

export type UpdateUserUseCaseInput = {
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
}

@singleton()
export class UpdateUserUseCase implements UseCase<UpdateUserUseCaseInput, void> {
  constructor (
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(input: UpdateUserUseCaseInput): Promise<void> {
    await this.usersRepository.updateById(input.userId, {
      email: input.email,
      name: input.name,
      phone: input.phone,
    });
  }
}