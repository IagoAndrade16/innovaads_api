import moment from "moment";

export class DomainDates {
  static format(value: Date, format: string) {
    return DomainDates.toBrazilianTimezone(value).format(format);
  }

  static toBrazilianTimezone(value: Date) {
    return moment(value).add(3, 'hours'); 
  }
}