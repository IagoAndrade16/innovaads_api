import { AppError } from "./AppError";

export class DomainError extends AppError {
	constructor(
		public statusCode: number,
		public reason: string | null,
		public data: object | null = null,
	) {
		super();
	}
}
