export default class ScheduleEvent {
  // required
  name!: string;
  startTime!: string;
  endTime!: string;
  weekday!: number;
  // optional
  color: string | undefined;
  building: string | undefined;
  room: string | undefined;

  constructor(eventJson: any) {
    this.setKeys(eventJson);
  }

  private setKeys(eventJson: any) {
    let keys = Object.keys(eventJson);
    for (let key of keys) {
      // @ts-ignore
      this[key] = eventJson[key];
    }
  }
}
