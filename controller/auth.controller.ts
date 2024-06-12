import { Request, Response } from "express";
import { IAuthService } from "../interface/auth.interface";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPatch,
  httpPost,
} from "inversify-express-utils";
import { INTERFACE_TYPE } from "../utils/constants";
import { AuthMiddleWare } from "../middleware/auth.middleware";

@controller("/auth")
export class AuthController {
  private readonly service;

  constructor(@inject(INTERFACE_TYPE.AUTHSERVICE) service: IAuthService) {
    this.service = service;
  }

  @httpPost("/create-account")
  public async createAccount(req: Request, res: Response) {
    try {
      console.log(req.body);
      const response = await this.service.onCreateAccount(req.body);

      res.cookie("access_token", response.body.data?.access_token, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
      });

      return res.status(response.statusCode).json(response.body);
    } catch (e) {
      console.log(e);
    }
  }

  @httpPost("/login")
  public async login(req: Request, res: Response) {
    try {
      console.log(req.body);
      const response = await this.service.onLogin(req.body);

      res.cookie("access_token", response.body.data?.access_token, {
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refresh_token", response.body.data?.refresh_token, {
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(response.statusCode).json(response.body);
    } catch (e) {
      console.log(e);
    }
  }

  @httpPatch(
    "/update-password",
    new AuthMiddleWare().privateRoute.bind(new AuthMiddleWare())
  )
  public async updatePassword(req: Request, res: Response) {
    try {
      const user = req.user?.email as string;
      const response = await this.service.onUpdatePassword(req.body, user);

      return res.status(response.statusCode).json(response.body);
    } catch (e) {
      console.log(e);
    }
  }

  @httpGet(
    "/logout",
    new AuthMiddleWare().privateRoute.bind(new AuthMiddleWare())
  )
  public async logout(req: Request, res: Response) {
    res.cookie("access_token", "");
    res.cookie("refresh_token", "");

    return res.status(200).json({
      status: "success",
      message: "User succesfully logged out",
    });
  }
}
