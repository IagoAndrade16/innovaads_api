import { inject, injectable } from "tsyringe";
import { EmailSenderProvider, SendEmailProvider } from "../EmailSenderProvider";
import { ApiProviderAxios, apiProviderAxiosAlias } from "../../api/ApiProviderAxios";
import { Environment } from "../../../core/Enviroment";
import { TemplaterProvider, templaterProviderAlias } from "../../templater/TemplaterProvider";
import { JsObject } from "../../../@types/JsObject";

@injectable()
export class EmailSenderProviderImpl implements EmailSenderProvider {
  constructor (
    @inject(apiProviderAxiosAlias)
    private readonly apiProvider: ApiProviderAxios,

    @inject(templaterProviderAlias)
    private readonly templaterProvider: TemplaterProvider,
  ) {}

  async send(input: SendEmailProvider): Promise<void> {
    const url = this.urlJoin('smtp/email');

    await this.apiProvider.post(url, {
      ...await this.buildEmailContent(input)
    }, this.headers());    
  }

  private async buildEmailContent(input: SendEmailProvider): Promise<JsObject> {
    return {
      sender: {
        name: Environment.vars.INNOVAADS_NAME,
        email: Environment.vars.INNOVAADS_EMAIL,
      },
      ...input,
      htmlContent: await this.getCompiledTemplate(input.htmlContent, input.replacements || {}),
    }
  }

  private async getCompiledTemplate(template: string, data: JsObject): Promise<string> {
    return this.templaterProvider.render(template, data);
  }

  private urlJoin(endpoint: string): string {
    return `${Environment.vars.BREVO_BASE_URL}/${endpoint}`;
  }

  private headers(): Record<string, string> {
    return {
      'api-key': `${Environment.vars.BREVO_API_KEY}`,
    }
  }
}