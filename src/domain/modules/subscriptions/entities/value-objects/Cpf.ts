import { cpf as cpfValidator } from 'cpf-cnpj-validator';

export class Cpf {
	constructor(public readonly value: string) {
		if (!value) {
			throw new Error('CPF is required');
		}

		if (!Cpf.isValid(value)) {
			throw new Error('CPF is invalid');
		}
	}

	static isValid(value: string): boolean {
		return cpfValidator.isValid(value);
	}

	static parse(value: string): Cpf {
		return new Cpf(value);
	}

	toString(): string {
		return this.value;
	}

	get onlyNumbers(): string {
		return this.value.replace(/\D/g, '');
	}

	get formatted(): string {
		return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
	}
}
