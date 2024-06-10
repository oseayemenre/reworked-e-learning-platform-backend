import { Request, Response } from "express";
import { IAuthService } from "../interface/auth.interface";
import { inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { AuthMiddleWare } from "../middleware/auth.middleware";
import { INTERFACE_TYPE } from "../utils/constants";

@controller("/auth")
export class AuthController {
  private readonly service;

  constructor(@inject(INTERFACE_TYPE.AUTHSERVICE) service: IAuthService) {
    this.service = service;
  }

  @httpPost("/create-account")
  public async createAccount(req: Request, res: Response) {
    try {
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

  @httpGet(
    "/private-route",
    new AuthMiddleWare().privateRoute.bind(new AuthMiddleWare())
  )
  public async PrivateRoute(req: Request, res: Response) {
    res.send("Private route");
  }
}
