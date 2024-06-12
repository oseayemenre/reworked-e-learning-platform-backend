import { IUUID } from "../interface/meeting.interface";
import { v4 as uuid } from "uuid";

export class UUID implements IUUID {
  createId(): string {
    return uuid().split("-")[uuid().split("-").length - 1];
  }
}
