import dotenv from 'dotenv';
import { InferType } from 'yup';
import * as yup from 'yup';
import { ValidationsUtils } from './ValidationUtils';

export class Environment {
  private static varsSchema = yup.object({
  	
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