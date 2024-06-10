import { injectable } from "inversify";
import { IJWT, IJWTParameters } from "../interface/auth.interface";
import jwt from "jsonwebtoken";

@injectable()
export class JWT implements IJWT {
  public createToken(data: IJWTParameters): string {
    return jwt.sign(data.tokenData, data.tokenSecret, {
      expiresIn: data.expiresIn,
    });
  }
}
