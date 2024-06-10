import { injectable } from "inversify";
import { IBcrypt } from "../interface/auth.interface";
import bcrypt from "bcrypt";

@injectable()
export class Bcrypt implements IBcrypt {
  public async confirmPassword(
    inputPassword: string,
    userPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(inputPassword, userPassword);
  }

  public async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
