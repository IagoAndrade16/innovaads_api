import moment from "moment";

export class DateUtils {
  static formatDate(date: Date | null, format?: string): string {
    return moment(date).format(format);
  }

  static subtractMonths(date: Date, months: number): Date {
    return moment(date).subtract(months, 'months').toDate();
  }

  static getNowByTimezone(timezone?: number): Date {
    if(!timezone) {
      return moment().utcOffset(-3).toDate();
    }

    return moment().utcOffset(timezone).toDate();
  }

  static format(value: Date, format: string) {
    return DateUtils.toBrazilianTimezone(value).format(format);
  }

  static createDateInstance(value: Date) {
    return moment(value).toDate();
  }

  static toBrazilianTimezone(value: Date) {
    return moment(value).add(3, 'hours'); 
  }

  static addSecondsToDate(date: Date, seconds: number): Date {
    return moment(date).add(seconds, 'seconds').toDate();
  }
}