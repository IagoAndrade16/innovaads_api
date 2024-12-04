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
}