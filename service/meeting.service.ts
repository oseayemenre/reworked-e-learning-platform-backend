import { inject, injectable } from "inversify";
import { IValidator } from "../interface/auth.interface";
import {
  IMeetingRepository,
  IMeetingService,
  IMeetingServiceOnCreateMeetingParams,
  IOnCreateMeetingResponse,
  IUUID,
} from "../interface/meeting.interface";
import { INTERFACE_TYPE } from "../utils/constants";
import { CreateMeetingSchema } from "../schema/meeting.schema";
import { MeetingEntity } from "../entity/meeting.entity";

@injectable()
export class MeetingService implements IMeetingService {
  private readonly validator;
  private readonly repository;
  private readonly uuid;

  constructor(
    @inject(INTERFACE_TYPE.IVALIDATOR) validator: IValidator,
    @inject(INTERFACE_TYPE.MEETINGREPOSITORY) repository: IMeetingRepository,
    @inject(INTERFACE_TYPE.UUID) uuid: IUUID
  ) {
    this.validator = validator;
    this.repository = repository;
    this.uuid = uuid;
  }
  public async onCreateMeeting(
    data: IMeetingServiceOnCreateMeetingParams,
    user: string
  ): Promise<IOnCreateMeetingResponse> {
    const validate = this.validator.validateData(data, CreateMeetingSchema);

    if (!validate) {
      return {
        statusCode: 400,
        body: {
          status: "failed",
          message: "Data could not be validated",
        },
      };
    }

    const meetingDurationToNumber = parseInt(
      data.meetingDuration.split(/s+/)[0]
    );

    let meetingDurationFormatted: Date;
    let meetingTimeFormatted: Date;
    let meetingData: MeetingEntity;
    let response: IOnCreateMeetingResponse | null = null;
    let meeting: MeetingEntity | null = null;

    const meetingDurationTime =
      data.meetingDuration.split(/s+/)[
        data.meetingDuration.split(/s+/).length - 1
      ];

    switch (meetingDurationTime) {
      case "minutes":
        meetingDurationFormatted = new Date(
          new Date(data.meetingTime).setMinutes(
            new Date(data.meetingTime).getMinutes() + meetingDurationToNumber
          )
        );

        meetingTimeFormatted = new Date(data.meetingTime);

        meetingData = {
          _name: data.name,
          _meetingTime: meetingTimeFormatted,
          _meetingId: this.uuid.createId(),
          _meetingDuration: meetingDurationFormatted,
        };

        meeting = await this.repository.createMeeting(meetingData, user);

        response = {
          statusCode: 201,
          body: {
            status: "success",
            message: "Meeting succesfuly created",
            data: meeting,
          },
        };

        break;

      case "seconds":
        meetingDurationFormatted = new Date(
          new Date(data.meetingTime).setSeconds(
            new Date(data.meetingTime).getSeconds() + meetingDurationToNumber
          )
        );

        meetingTimeFormatted = new Date(data.meetingTime);

        meetingData = {
          _name: data.name,
          _meetingTime: meetingTimeFormatted,
          _meetingId: this.uuid.createId(),
          _meetingDuration: meetingDurationFormatted,
        };

        meeting = await this.repository.createMeeting(meetingData, user);

        response = {
          statusCode: 201,
          body: {
            status: "success",
            message: "Meeting succesfuly created",
            data: meeting,
          },
        };
        break;

      case "hours":
        meetingDurationFormatted = new Date(
          new Date(data.meetingTime).setHours(
            new Date(data.meetingTime).getHours() + meetingDurationToNumber
          )
        );

        meetingTimeFormatted = new Date(data.meetingTime);

        meetingData = {
          _name: data.name,
          _meetingTime: meetingTimeFormatted,
          _meetingId: this.uuid.createId(),
          _meetingDuration: meetingDurationFormatted,
        };

        meeting = await this.repository.createMeeting(meetingData, user);

        meeting = await this.repository.createMeeting(meetingData, user);

        response = {
          statusCode: 201,
          body: {
            status: "success",
            message: "Meeting succesfuly created",
            data: meeting,
          },
        };

        break;
    }

    if (!meeting)
      return {
        statusCode: 400,
        body: {
          status: "failed",
          message: "Meeting could not be created",
        },
      };

    return response as IOnCreateMeetingResponse;
  }
}
