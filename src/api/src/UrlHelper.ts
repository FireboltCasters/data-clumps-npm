export default class UrlHelper {
  static STUDIP_DOMAIN_UNI_OSNABRUECK = 'https://studip.uni-osnabrueck.de';
  static STUDIP_DOMAIN = '';
  static STUDIP_PATH_USER = '/api.php/user/';
  static STUDIP_PATH_SCHEDULE = '/schedule';

  // https://hilfe.studip.de/develop/Entwickler/RESTAPI
  static getUserURL(): string {
    return UrlHelper.getUserURLByDomain(UrlHelper.STUDIP_DOMAIN);
  }

  static getUserURLByDomain(baseURL: string): string {
    return baseURL + UrlHelper.STUDIP_PATH_USER;
  }

  static getScheduleURL(user_id: string): string {
    return UrlHelper.getSchedulesURLByDomain(UrlHelper.STUDIP_DOMAIN, user_id);
  }

  static getSchedulesURLByDomain(baseURL: string, user_id: string): string {
    return UrlHelper.getUserURLByDomain(baseURL) + user_id + UrlHelper.STUDIP_PATH_SCHEDULE;
  }
}
