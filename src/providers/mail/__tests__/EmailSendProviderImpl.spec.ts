import { find } from "../../../core/DependencyInjection";
import { Environment } from "../../../core/Enviroment";
import { ApiProviderAxios, apiProviderAxiosAlias } from "../../api/ApiProviderAxios";
import { ApiResponse } from "../../api/implementations/ApiProviderAxiosImpl";
import { EmailSenderProvider, emailSenderProviderAlias } from "../EmailSenderProvider";


const emailSenderProvider = find<EmailSenderProvider>(emailSenderProviderAlias);
const apiProvider = find<ApiProviderAxios>(apiProviderAxiosAlias);

it('should send email', async () => {
  jest.spyOn(apiProvider, 'post').mockResolvedValueOnce({} as ApiResponse);

  await emailSenderProvider.send({
    to: [{
      email: 'test@email.com',
    }],
    subject: 'Test',
    htmlContent: '<h1>Test</h1>',
    replacements: {}
  }); 

  expect(apiProvider.post).toHaveBeenCalledTimes(1);
  expect(apiProvider.post).toHaveBeenCalledWith(expect.stringContaining(Environment.vars.BREVO_BASE_URL), {
    sender: {
      name: Environment.vars.INNOVAADS_NAME,
      email: Environment.vars.INNOVAADS_EMAIL,
    },
    to: [{
      email: 'test@email.com',
    }],
    subject: 'Test',
    htmlContent: '<h1>Test</h1>',
    replacements: {}
  }, {
    'api-key': Environment.vars.BREVO_API_KEY,
  });
});