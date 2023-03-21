import ScheduleEvent from '../models/ScheduleEvent';

export default class ScheduleLoader {
  static parseStudIPEventstoTimetableEvents(data: any): ScheduleEvent[] {
    let events: ScheduleEvent[] = [];
    const weekdays = 7;
    for (let weekdayIndex = 0; weekdayIndex < weekdays; weekdayIndex++) {
      const dataForWeekday = data[weekdayIndex];
      for (const index in dataForWeekday) {
        const rawEventAtWeekday = dataForWeekday[index];
        let event = ScheduleLoader.parseRawEventToScheduleEvent(
          weekdayIndex,
          rawEventAtWeekday
        );
        events.push(event);
      }
    }
    return events;
  }

  static parseRawStudIPEventColor(rawColor: number){
    const defaultColor = "#d60000"; // same as color 3

    const rawColorString = rawColor+"";

    switch(rawColorString){
      case "1": return "#682c8b";
      case "2": return "#b02e7c";
      case "3": return "#d60000"; // same as default
      case "4": return "#f26e00";
      case "5": return "#ffbd33";
      case "6": return "#6ead10";
      case "7": return "#008512";
      case "8": return "#129c94";
      case "9": return "#a85d45";
      case "10": return "#a480b9";
      case "11": return "#d082b0";
      case "12": return "#e66666";
      case "13": return "#f7a866";
      case "14": return "#ffd785";
      case "15": return "#a8ce70";
      default: return defaultColor;
    }
  }


  static parseRawEventToScheduleEvent(
    weekdayIndex: number,
    rawEventAtWeekday: any
  ): ScheduleEvent {
    let buildingAndRoom = ScheduleLoader.filterStudIPBuilding(
      rawEventAtWeekday.title
    );
    let eventJson = {
      name: ScheduleLoader.filterNameFromEventContent(
        rawEventAtWeekday.content
      ),
      location: rawEventAtWeekday.title,
      building: buildingAndRoom.building,
      room: buildingAndRoom.room,
      start: ScheduleLoader.getTimeFromStudIPTime(rawEventAtWeekday.start),
      end: ScheduleLoader.getTimeFromStudIPTime(rawEventAtWeekday.end),
      weekday: weekdayIndex,
      color: ScheduleLoader.parseRawStudIPEventColor(rawEventAtWeekday.color),
    };
    return new ScheduleEvent(eventJson);
  }

  static filterNameFromEventContent(content: string): string {
    return content.replace(/\d+(\.)\d+/g, '').trim();
  }

  /**
   * filters the building and room from the title given by StudIP
   * @param {String} eventTitle
   */
  static filterStudIPBuilding(eventTitle: string): any {
    let title = eventTitle;
    let regBuildingRoom =
      /(\w{1,2})\s?\/\s?([E,B,\d]\d{2})|(\w{1,2})\s([E,B,\d]\d{2})/g;

    let buildingAndRoom = title.match(regBuildingRoom);

    let building = '';
    let room = '';

    if (!!buildingAndRoom && buildingAndRoom.length > 0) {
      let buildingAndRoomMatch = buildingAndRoom[0];

      let regBuilding = /(\w{1,2}(?=[\s?\/,\s?]))/g;
      let buildingMatches = buildingAndRoomMatch.match(regBuilding);
      /* istanbul ignore else */ //we ignore the else case since its covered already by building=""
      if (!!buildingMatches && buildingMatches.length > 0) {
        building = buildingMatches[0];
      }

      let regRoom = /([E,B,\d]\d{2})/g;
      let roomMatches = buildingAndRoomMatch.match(regRoom);

      /* istanbul ignore else */ //we ignore the else case since its covered already by room=""
      if (!!roomMatches && roomMatches.length > 0) {
        room = roomMatches[0];
      }
    }
    return {building: building, room: room};
  }

  static getTimeFromStudIPTime(studIPTime: number): string {
    let hour: string = '' + Math.floor(studIPTime / 100);
    hour = ScheduleLoader.padTime(hour);
    let minutes: string = '' + (studIPTime % 100);
    minutes = ScheduleLoader.padTime(minutes);
    return hour + ':' + minutes;
  }

  static padTime(hourOrMinutes: string): string {
    return hourOrMinutes.padStart(2, '0'); // "9" --> "09" --> this will result in time formats for "09:07"
  }
}
