import { cnpj as cnpjValidator } from 'cpf-cnpj-validator';


export class Cnpj {
	constructor(public readonly value: string) {
		if (!value) {
			throw new Error('CNPJ is required');
		}

		if (!Cnpj.isValid(value)) {
			throw new Error('Invalid CNPJ');
		}
	}

	static isValid(value: string): boolean {
		return cnpjValidator.isValid(value);
	}

	static parse(value: string): Cnpj {
		return new Cnpj(value);
	}

	toString(): string {
		return this.value;
	}

	get onlyNumbers(): string {
		return this.value.replace(/\D/g, '');
	}

	get formatted(): string {
		return this.value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
	}
}
