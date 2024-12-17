import { JsObject } from "../../@types/JsObject";

export type EmailSenderProvider = {
  send(input: SendEmailProvider): Promise<void>;
};

export type SendEmailProvider = {
  to: {
    email: string;
  }[];
  subject: string;
  htmlContent: string;
  replacements?: JsObject;
}

export const emailSenderProviderAlias = 'EmailSenderProvider' as const;