import Base64Helper from './Base64Helper';
import UrlHelper from './UrlHelper';
import User from './models/User';
import ScheduleLoader from './ignoreCoverage/ScheduleLoader';
import FetchHelper from './ignoreCoverage/FetchHelper';

export default class Connector {
  static ERROR_MAINTENANCE = 'Wartungsarbeiten';

  private readonly studIpDomain: string;
  private readonly username: string;
  private readonly password: string;
  // @ts-ignore //since we can only the the client when user is found, it cant be undefined
  private user: User;

  private constructor(studIpDomain: string, username: string, password: string) {
    this.studIpDomain = studIpDomain;
    this.username = username;
    this.password = password;
  }

  static async getClient(
    studIpDomain: string,
    username: string,
    password: string
  ): Promise<Connector> {
    UrlHelper.STUDIP_DOMAIN = studIpDomain;
    const client = new Connector(studIpDomain, username, password);
    await client.login();
    return client;
  }

  getUser(): User {
    return this.user;
  }

  private async login() {
    this.user = await this.loadUser();
  }

  async loadUserRaw(): Promise<any> {
    const url = UrlHelper.getUserURLByDomain(this.studIpDomain);
    const headers = this.getHeaders();
    let answer = await FetchHelper.getUser(url, headers);
    this.checkIfErrorLoadingUserRaw(answer);
    return answer?.data;
  }

  checkIfErrorLoadingUserRaw(answer: any) {
    let data = answer.data;
    if (typeof data === 'string' && data.includes('Wartungsarbeiten')) {
      throw new Error(Connector.ERROR_MAINTENANCE);
    }
  }

  private async loadUser(): Promise<User> {
    const data = await this.loadUserRaw();
    return new User(data);
  }

  getHeaders() {
    let token: string = Base64Helper.toBase64(
      this.username + ':' + this.password
    );
    return {
      'Content-Type': 'text/json',
      Authorization: 'Basic ' + token, //the token is a variable which holds the token
    };
  }

  async loadScheduleRaw(): Promise<any> {
    const user = this.getUser();
    const url = UrlHelper.getScheduleURL(user.user_id);
    const headers = this.getHeaders();
    let answer = await FetchHelper.getScheduleRaw(url, headers);
    return answer?.data;
  }

  async loadSchedule() {
    let data = await this.loadScheduleRaw();
    return ScheduleLoader.parseStudIPEventstoTimetableEvents(data);
  }
}
