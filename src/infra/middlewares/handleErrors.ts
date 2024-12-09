import { Request, Response } from 'express';
import * as yup from 'yup';

import { ValidationsUtils } from '../../core/ValidationUtils';
import { DomainError } from '../errors/DomainError';

export function handleErrors(
	err: Error,
	_req: Request,
	res: Response,
): Response {
	if (err instanceof DomainError) {
		if (!err.reason) {
			return res.status(err.statusCode).send();
		}

		return res.status(err.statusCode).json({
			result: 'ERROR',
			reason: err.reason,
			data: err.data,
		});
	}

	if (err instanceof yup.ValidationError) {
		const yupErrors = ValidationsUtils.formatYupErrors(err);
		return res.status(400).json(yupErrors);
	}

	console.log(err);

	return res.status(500).json({
		message: 'Internal server error',
	});
}
