import { Status } from "../enum/status.enum";

export class Receipt {
  id: string;
  name: string;
  description: string;
  sourceID: string;
  sourceSlackID: string;
  status: Status;
  image?: string;

  constructor(fields: any) {
    for (const f in fields) {
      this[f] = fields[f];
    }
  }
}
