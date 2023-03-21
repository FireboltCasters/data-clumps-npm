'use strict';
import exampleUser from './exampleUser.json';
import exampleScheduleRaw from './exampleScheduleRaw.json';
import exampleSchedule from './exampleSchedule.json';

/**
 * FakeBackend class
 *
 * @class FakeBackend
 */
export default class FakeBackend {
  static IS_ACTIVE = false;

  static getRawExampleUser() {
    return exampleUser;
  }

  static getRawExampleUserWithRole(rolename: string) {
    let copy = JSON.parse(JSON.stringify(exampleUser));
    copy.username = rolename;
    copy.perms = rolename;
    let capitalized = rolename.charAt(0).toUpperCase() + rolename.slice(1);
    copy.name.given = capitalized
    copy.name.formatted = capitalized + " Studip"
    copy.name.username = rolename+"@studip.com";
    return copy;
  }

  static getMainentanceError() {
    return {
      data: '<!DOCTYPE html>\nStud.IP ist zur Zeit wegen Wartungsarbeiten nicht verf&uuml;gbar\\',
    };
  }

  static getRawExampleSchedule() {
    return exampleScheduleRaw;
  }

  static getParsedExampleSchedule() {
    return exampleSchedule;
  }
}
