import { Cnpj } from './Cnpj';
import { Cpf } from './Cpf';

export class Document {
	private readonly value: Cpf | Cnpj;

	static parse(value: string): Document {
		return new Document(value);
	}

	private constructor(value: string) {
		if (Cnpj.isValid(value)) {
			this.value = new Cnpj(value);
		} else if (Cpf.isValid(value)) {
			this.value = new Cpf(value);
		} else {
			throw new Error('Document needs to be either a valid CPF or CNPJ');
		}
	}

	static isValid(value: string): boolean {
		return Cnpj.isValid(value) || Cpf.isValid(value);
	}

	onlyNumbers(): string {
		return this.value.onlyNumbers;
	}

	formatted(): string {
		return this.value.formatted;
	}

	isCpf(): boolean {
		return this.value instanceof Cpf;
	}

	isCnpj(): boolean {
		return this.value instanceof Cnpj;
	}

	toString(): string {
		return this.value.toString();
	}
}
