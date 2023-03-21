'use strict';
import FakeBackend from './FakeBackend';
import axios from 'axios';

/**
 * FetchHelper class
 *
 * @class FetchHelper
 */
export default class FetchHelper {
  static async getUser(url: string, headers: any) {
    if (FakeBackend.IS_ACTIVE) {
      return {
        data: FakeBackend.getRawExampleUser(),
      };
    } else {
      return await axios.get(url, {
        headers: headers,
      });
    }
  }

  static async getScheduleRaw(url: string, headers: any) {
    if (FakeBackend.IS_ACTIVE) {
      return {
        data: FakeBackend.getRawExampleSchedule(),
      };
    } else {
      return await axios.get(url, {
        headers: headers,
      });
    }
  }
}
