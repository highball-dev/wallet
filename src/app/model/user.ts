export class User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  profile?: string;
  group?: string;
  slackID?: string;

  constructor(fields: any) {
    for (const f in fields) {
      this[f] = fields[f];
    }
  }
}
