import path from "path";
import fs from "fs";
import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { UsersRepository, usersRepositoryAlias } from "../repositories/UsersRepository";
import { Users2FARepository, users2FARepositoryAlias } from "../repositories/Users2FARepository";

import { RandomProvider, randomProviderAlias } from "../../../../providers/random/RandomProvider";
import { EmailSenderProvider, emailSenderProviderAlias } from "../../../../providers/mail/EmailSenderProvider";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";

export type SendUser2FAUseCaseInput = {
  userId: string;
}

export type SendCodeByEmaiInput = {
  email: string;
  code: string;
  name: string;
}

@singleton()
export class SendUser2FAUseCase implements UseCase<SendUser2FAUseCaseInput, void> {
  constructor (
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,
    
    @inject(users2FARepositoryAlias)
    private readonly users2FARepository: Users2FARepository,

    @inject(randomProviderAlias)
    private readonly randomProvider: RandomProvider,

    @inject(emailSenderProviderAlias)
    private readonly emailSenderProvider: EmailSenderProvider,
  ) {}

  async execute(input: SendUser2FAUseCaseInput): Promise<void> {
    const user = await this.usersRepository.findById(input.userId);
    
    if (!user) {
      throw new UserNotFoundError();
    }
    
    const codeGenerated = await this.randomProvider.integer(100000, 999999);

    const user2FACode = await this.users2FARepository.findLastCodeByUserId(user.id);

    if (!user2FACode || user2FACode.alreadyUsed) {
      await this.users2FARepository.insert({
        userId: user.id,
        email: user.email,
        code: codeGenerated.toString(),
      });
    } else {
      await this.users2FARepository.updateById(user2FACode.id, {
        code: codeGenerated.toString(),
      })
    }

    await this.sendCodeByEmail({
      code: codeGenerated.toString(),
      email: user.email,
      name: user.name,
    })
  }

  async sendCodeByEmail(input: SendCodeByEmaiInput): Promise<void> {
    const emailTemplatePath = path.join(__dirname, '..', 'templates', 'send-user-2fa.hbs');
    const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

    await this.emailSenderProvider.send({
      htmlContent: emailTemplate,
      subject: 'Seu código de verificação - InnovaADS',
      to: [{
        email: input.email,
      }],
      replacements: {
        code: input.code,
        name: input.name,
      }
    });
  }
}