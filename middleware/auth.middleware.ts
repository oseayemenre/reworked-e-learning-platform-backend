import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../utils/secret";
import { injectable } from "inversify";

declare global {
  namespace Express {
    interface Request {
      user?: { email: string };
    }
  }
}

@injectable()
export class AuthMiddleWare {
  private access_token: string | null = null;
  private refresh_token: string | null = null;

  public async privateRoute(req: Request, res: Response, next: NextFunction) {
    this.access_token = req.cookies.access_token;
    this.refresh_token = req.cookies.refresh_token;

    if (!this.access_token) {
      if (this.refresh_token) {
        const decode_refresh_token = jwt.verify(
          this.refresh_token as string,
          REFRESH_TOKEN_SECRET
        );

        if (!decode_refresh_token)
          return res.status(401).json({
            status: "failed",
            message: "Refresh token could not be verified as valid",
          });

        const new_access_token = jwt.sign(
          decode_refresh_token,
          ACCESS_TOKEN_SECRET
        );

        res.cookie("access_token", new_access_token, {
          maxAge: 15 * 60 * 1000,
          httpOnly: true,
        });

        res.cookie("refresh_token", new_access_token, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
        });

        return next();
      }

      return res.status(404).json({
        status: "failed",
        message: "No access token",
      });
    }

    const decoded_access_token = jwt.verify(
      this.access_token as string,
      ACCESS_TOKEN_SECRET
    );

    if (!decoded_access_token)
      return res.status(401).json({
        status: "failed",
        message: "Access token could not be verified as valid",
      });

    req.user = decoded_access_token as { email: string };

    return next();
  }
}
