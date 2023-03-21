const base64 = require('Base64');

export default class Base64Helper {
  static toBase64(string: string) {
    return base64.btoa(string);
  }

  static fromBase64(string: string) {
    return base64.atob(string);
  }
}
