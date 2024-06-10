import { injectable } from "inversify";
import {
  IAuthCreateAccountParameters,
  IValidator,
} from "../interface/auth.interface";

@injectable()
export class Validator implements IValidator {
  public validateData(
    data: IAuthCreateAccountParameters,
    schema: Zod.Schema
  ): boolean {
    const valid = schema.safeParse(data);
    return valid.success;
  }
}
