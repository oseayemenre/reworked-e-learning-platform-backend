import { IMeetingService } from "../interface/meeting.interface";
import { Request, Response } from "express";
import { controller, httpPost } from "inversify-express-utils";
import { AuthMiddleWare } from "../middleware/auth.middleware";
import { inject } from "inversify";
import { INTERFACE_TYPE } from "../utils/constants";

@controller("/meeting")
export class MeetingController {
  private readonly service;

  constructor(@inject(INTERFACE_TYPE.MEETINGSERVICE) service: IMeetingService) {
    this.service = service;
  }

  @httpPost(
    "/create",
    new AuthMiddleWare().privateRoute.bind(new AuthMiddleWare())
  )
  public async createMeeting(req: Request, res: Response) {
    try {
      const response = await this.service.onCreateMeeting(
        req.body,
        req.user?.email as string
      );

      return res.status(response.statusCode).json(response.body);
    } catch (e) {
      console.log(e);
    }
  }
}
