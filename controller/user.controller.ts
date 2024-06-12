import { Request, Response } from "express";
import { controller, httpGet } from "inversify-express-utils";
import { AuthMiddleWare } from "../middleware/auth.middleware";
import { IUserService } from "../interface/user.interface";
import { inject } from "inversify";
import { INTERFACE_TYPE } from "../utils/constants";

@controller("/user")
export class UserController {
  private readonly service;

  constructor(@inject(INTERFACE_TYPE.USERSERVICE) service: IUserService) {
    this.service = service;
  }

  @httpGet("/", new AuthMiddleWare().privateRoute.bind(new AuthMiddleWare()))
  public async getUser(req: Request, res: Response) {
    try {
      const response = await this.service.onGetUser(req.user?.email as string);

      return res.status(response.statusCode).json(response.body);
    } catch (e) {
      console.log(e);
    }
  }
}
