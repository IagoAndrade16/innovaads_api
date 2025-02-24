/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express';
import moment from 'moment';
import { JsObject } from '../@types/JsObject';

export class Utils {
	static waitAllToArray<T>(promises: Promise<T>[]): Promise<T[]> {
		return new Promise((resolve) => {
			Promise.all(promises).then((values) => {
				resolve(values);
			});
		});
	}

	static range(length: number): number[] {
		return Array.from({ length }, (_, i) => i);
	}

	public static clean(value: string): string {
		if (typeof value !== 'string') return value;

		return value
			.replace(' ', '')
			.replace('-', '')
			.replace('.', '')
			.replace('/', '')
			.replace('\\', '')
			.replace('(', '')
			.replace(')', '');
	}

	public static applyMask(mask: string, value: string, maxLength?: number) {
		const maxLengthOfValue = (maxLength ?? mask.length);
		let valueIfOverflowMaskLength: string | null = null;

		if (value.length > maxLengthOfValue) {
			valueIfOverflowMaskLength = value.slice(0, -1);
		}

		const cleanedValue = Utils.clean(valueIfOverflowMaskLength ?? value);

		const numChar = '0';
		const alphaChar = 'a';
		const alphaNumChars = ['[a0]', '[0a]'];
		const allChar = '*';

		let res = '';
		let charCounter = 0;
		for (let i = 0; i < mask.length; i++) {
			if (charCounter >= cleanedValue.length) break;

			if (mask[i] === numChar) {
				if (Utils.isNumeric(cleanedValue[charCounter])) res += cleanedValue[charCounter];
				charCounter++;
			} else if (mask[i] === alphaChar) {
				if (Utils.isAlphabetic(cleanedValue[charCounter])) res += cleanedValue[charCounter];
				charCounter++;
			} else if (mask[i] === '[') {
				const endingIndex = mask.indexOf(']', i);
				const multiChar = mask.substring(i, endingIndex + 1);

				if (alphaNumChars.includes(multiChar)) {
					if (Utils.isAlphaNumeric(cleanedValue[charCounter])) res += cleanedValue[charCounter];
					charCounter++;
					i += multiChar.length - 1;
				}
			} else if (mask[i] === allChar) {
				res += cleanedValue[charCounter];
				charCounter++;
			} else {
				res += mask[i];
			}
		}

		return res;
	}

	public static isNumeric(str: string) {
		return /^\d+$/.test(str);
	}

	static isInt(value: any): boolean {
		 
		return !Number.isNaN(value) && (function (x) { return (x | 0) === x; }(parseFloat(value)));
	}

	public static isAlphabetic(str: string) {
		return str.match('^[a-zA-Z]+$');
	}

	public static isAlphaNumeric(str: string) {
		const alphanumeric = /^[\p{L}\p{N}]*$/u;
		return str.match(alphanumeric);
	}

	// inclusive, inclusive
	// example: clamp(x, 2, 10) -> 2 <= x <= 10
	static clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max);
	}

	static replaceSequentially(str: string, original: string, replace: any[]) {
		return replace.reduce((str, value) => str.replace(original, value), str);
	}

	/**
	 * Divide an array in two
	 *
	 * Destruct by [fail, pass] = divideArrayBy()
	 */
	static divideArrayBy<T>(array: T[], isValid: (v: T) => boolean): T[][] {
		const fail : T[] = [];
		const pass : T[] = [];

		array.forEach((v) => {
			if (isValid(v)) pass.push(v);
			else fail.push(v);
		});

		return [fail, pass];
	}

	static splitArray<T>(array: T[], filters: ((v: T) => boolean)[]) {
		const result: T[][] = [];

		filters.forEach(() => result.push([]));

		array.forEach((v) => {
			filters.forEach((filter, i) => {
				if (filter(v)) result[i].push(v);
			});
		});

		return result;
	}

	static generateStringOfLength(length: number, char = '0'): string {
		return Array(length).fill(char).join('');
	}

	static settedCount(params: any[]): number {
		return Utils.booleanSum(params);
	}

	static booleanSum(params: any[]): number {
		return params.reduce<number>((sum, v) => sum + Utils.booleanInt(v), 0);
	}

	static booleanInt(param: any): number {
		return +(param != null);
	}

	static capitalize(value: string): string {
		if (value.length === 0) return value;
		return value.charAt(0).toUpperCase() + value.slice(1);
	}

	static removePhoneCountryCode(phone: string): string {
		return phone.replace(/^(\+55|55)/, '');
	}

	static hasMore3RepeatedNumbers(value: string): boolean {
		return /(\d)\1\1/.test(value);
	}

	static getBasicAuthContentFromReq(req: Request) {
		const b64Auth = (req.headers.authorization ?? '').split(' ')[1] ?? '';
		const [user, password] = Buffer.from(b64Auth, 'base64').toString().split(':');

		return [user, password];
	}

	static checksIfIsLegalAge(userBirthDate?: Date | null): boolean {
		return moment(new Date()).diff(moment(userBirthDate), 'years') >= 18;
	}

	static splitInChunks<T>(chunkSize: number, array: T[]): T[][] {
		const result: T[][] = [];

		for (let i = 0; i < array.length; i += chunkSize) {
			result.push(array.slice(i, i + chunkSize));
		}

		return result;
	}

	public static async sleep(milliseconds: number) {
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				resolve();
			}, milliseconds);
		});
	}

	public static dateNow(format?: string): string {
		return moment().format(format ?? 'DD/MM/YYYY HH:mm:ss');
	}

	public static removeSpecialCharacters(str: string): string {
		if (!str) {
			return '';
		}
		// Remove acentos
		const strWithoutAccents = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

		// Remove caracteres especiais (incluindo ponto final, vírgula, etc...)
		const strWithoutSpecials = strWithoutAccents.replace(/[^\w\s]/gi, '');

		return strWithoutSpecials;
	}

	public static buildQueryParams(data?: JsObject): string {
		if (!data || Object.keys(data).length === 0) {
			return '';
		}

		return Object.keys(data).map((key) => `${key}=${data[key]}`).join('&');
	}
}
