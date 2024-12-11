/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { DomainError } from "../errors/DomainError";
import * as yup from 'yup';
import { ValidationsUtils } from "../../core/ValidationUtils";


export const handleErrors = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof DomainError) {
    if (!err.reason) {
      res.status(err.statusCode).send();
			return;
    }

    res.status(err.statusCode).send({
			result: 'ERROR',
			reason: err.reason,
			data: err.data,
		});
		return;
  }

  if (err instanceof yup.ValidationError) {
		const yupErrors = ValidationsUtils.formatYupErrors(err);
		res.status(400).send(yupErrors);
		return;
	}

	console.log(err);

	res.status(500).send({
		message: 'Internal server error',
	});
}