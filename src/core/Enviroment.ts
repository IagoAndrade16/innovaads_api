import dotenv from 'dotenv';
import { InferType } from 'yup';
import * as yup from 'yup';
import { ValidationsUtils } from './ValidationUtils';

export class Environment {
  private static varsSchema = yup.object({
		NODE_ENV: yup.string().required(),
		PORT: yup.number().required(),

		MYSQL_DATABASE: yup.string().required(),
  	MYSQL_PORT: yup.number().required(),
		MYSQL_HOST: yup.string().required(),
		MYSQL_USER: yup.string().required(),
		MYSQL_PASS: yup.string().required(),

		DB_LOGGING: yup.boolean().required(),

		JWT_EXPIRES_IN_SECONDS: yup.number().required(),
		JWT_SECRET_KEY: yup.string().required(),

		BREVO_BASE_URL: yup.string().required(),
		BREVO_API_KEY: yup.string().required(),

		INNOVAADS_NAME: yup.string().required(),
		INNOVAADS_EMAIL: yup.string().required(),

		GEOCODING_API_URL: yup.string().required(),

		PAGARME_API_KEY: yup.string().required(),

		APPLICATION_LOG_LEVEL: yup.string().optional().oneOf(['debug', 'info', 'warn', 'error', 'silent', 'fatal', 'trace']).default('info'),

		FACEBOOK_GRAPH_API_URL: yup.string().required(),
		FACEBOOK_ACCESS_TOKEN: yup.string().required(),
		
		GOOGLE_CLIENT_ID: yup.string().required(),
		GOOGLE_CLIENT_SECRET_KEY: yup.string().required(),
  });

  static vars: InferType<typeof Environment.varsSchema>;

  static assertInitialized() {
  	if (Environment.isInitialized()) return;
  	dotenv.config();

  	try {
  		Environment.vars = this.varsSchema.validateSync(process.env, {
  			abortEarly: false,
  		});
  	} catch (err) {
  		if (err instanceof yup.ValidationError) {
  			const formatted = ValidationsUtils.formatYupErrors(err);
  			throw new Error(
  				JSON.stringify({
  					environment: formatted,
  				}),
  			);
  		}
  	}
  }

  private static isInitialized() {
  	return Environment.vars !== undefined;
  }

  static getType(): 'dev' | 'test' | 'prod' {
  	return process.env.NODE_ENV as 'dev' | 'test' | 'prod';
  }

	static isProduction() {
		return Environment.getType() === 'prod';
	}

	static isDevelopment() {
		return Environment.getType() === 'dev';
	}

	static isTest() {
		return Environment.getType() === 'test';
	}
}