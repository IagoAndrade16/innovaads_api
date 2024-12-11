import { ValidationError } from "yup";


export class ValidationsUtils {
	static formatYupErrors(err: ValidationError): object {
		return err.inner.reduce(
			(acc, err) => ({ ...acc, [err.path as string]: err.message }),
			{},
		);
	}

	static validateEmail(email: string): boolean {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		return emailRegex.test(email);
	}
}