import { Utils } from "../../../../../core/Utils";

export class PhoneNumber {
  private value: string;

  constructor(value: string | undefined) {
    if(!value) {
      throw new Error('Phone number is required');
    }

    const valueCleaned = Utils.clean(value);

    if(valueCleaned.length !== 11) {
      throw new Error('Invalid phone number');
    }

    this.value = `55${valueCleaned}`;
  }

  static parse(phoneNumber: string | undefined): PhoneNumber {
    return new PhoneNumber(phoneNumber);
  }

  static isValid(phoneNumber: string | undefined): boolean {
    try {
      new PhoneNumber(phoneNumber);
      return true;
    } catch {
      return false;
    }
  }

  cleaned(): string {
    return this.value;
  }

  fullNumber(): string {
    return this.value;
  }

  formatted(): string {
    return Utils.applyMask('(00) 00000-0000', this.value);
  }

  withoutDDD(): string {
    return this.value.slice(4);
  }

  withCountryCodeAndDDD(): string {
    return `${this.value}`;
  }

  get countryCode(): string {
    return this.value.slice(0, 2);
  }

  get areaCode(): string {
    return this.value.slice(2, 4);
  }

  get number(): string {
    return this.value.slice(4);
  }
}