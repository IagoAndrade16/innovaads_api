import path from "path";
import fs from "fs";
import { inject, singleton } from "tsyringe";
import { UseCase } from "../../../../core/UseCase";
import { usersForgotPassword2FARepositoryAlias, UsersForgotPassword2FARepository } from "../repositories/UsersForgotPassword2FARepository";
import { RandomProvider, randomProviderAlias } from "../../../../providers/random/RandomProvider";
import { EmailSenderProvider, emailSenderProviderAlias } from "../../../../providers/mail/EmailSenderProvider";
import { UsersRepository, usersRepositoryAlias } from "../repositories/UsersRepository";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";

export type Send2FAForgotPasswordUseCaseInput = {
  email: string;
}

export type SendCodeByEmaiInput = {
  email: string;
  code: string;
}

@singleton()
export class Send2FAForgotPasswordUseCase implements UseCase<Send2FAForgotPasswordUseCaseInput, void> {
  constructor (
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(usersForgotPassword2FARepositoryAlias)
    private readonly userForgotPassword2FARepository: UsersForgotPassword2FARepository,

    @inject(randomProviderAlias)
    private readonly randomProvider: RandomProvider,

    @inject(emailSenderProviderAlias)
    private readonly emailSenderProvider: EmailSenderProvider,
  ) {}

  async execute(input: Send2FAForgotPasswordUseCaseInput): Promise<void> {
    const user = await this.usersRepository.findByEmail(input.email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const codeGenerated = await this.randomProvider.integer(100000, 999999);

    const userForgotPasswordCode = await this.userForgotPassword2FARepository.findByEmail(input.email);

    if (!userForgotPasswordCode || userForgotPasswordCode.alreadyUsed) {
      await this.userForgotPassword2FARepository.insert({
        email: input.email,
        userId: user.id,
        code: codeGenerated.toString(),
      });
    } else {
      await this.userForgotPassword2FARepository.updateById(userForgotPasswordCode.id, {
        code: codeGenerated.toString(),
      });
    }

    await this.sendCodeByEmail({
      code: codeGenerated.toString(),
      email: input.email,
    });
  }

   async sendCodeByEmail(input: SendCodeByEmaiInput): Promise<void> {
      const emailTemplatePath = path.join(__dirname, '..', 'templates', 'send-user-forgot-password-2fa.hbs');
      const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');
  
      await this.emailSenderProvider.send({
        htmlContent: emailTemplate,
        subject: 'Seu código de verificação - InnovaADS',
        to: [{
          email: input.email,
        }],
        replacements: {
          code: input.code,
        }
      });
    } 
}