import moment from "moment";

export class DomainDates {
  static format(value: Date, format: string) {
    return moment(value).format(format);
  }
}