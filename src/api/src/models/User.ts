import Perm from './Perm';

export default class User {
  // required
  user_id!: string;
  username!: string;
  perms!: Perm;
  email!: string;
  profile!: any;
  name!: any;
  // optional
  avatar_small: string | undefined;
  avatar_medium: string | undefined;
  avatar_normal: string | undefined;
  avatar_original: string | undefined;
  phone: string | undefined;
  homepage: string | undefined;
  privadr: string | undefined;
  datafields: any[] | undefined;

  constructor(studipJson: any) {
    this.setKeys(studipJson);
  }

  private setKeys(studipJson: any) {
    let keys = Object.keys(studipJson);
    for (let key of keys) {
      // @ts-ignore
      this[key] = studipJson[key];
    }
  }
}
