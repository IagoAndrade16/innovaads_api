import moment from "moment";

export class MomentUtils {
  static formatDate(date: Date, format?: string): string {
    return moment(date).format(format);
  }

  static subtractMonths(date: Date, months: number): Date {
    return moment(date).subtract(months, 'months').toDate();
  }
}