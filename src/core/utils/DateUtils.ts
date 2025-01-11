import moment from "moment";

export class DateUtils {
  static getNow(utc?: number): Date {
    return moment().add(utc || 0, 'hours').toDate();
  }

  static getNowBrazilTime(): Date {
    return moment().subtract(3, 'hours').toDate();
  }
}
