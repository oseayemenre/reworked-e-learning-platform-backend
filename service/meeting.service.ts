import { inject } from "inversify";
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

    let metingDurationFormatted: Date;
    let meetingTimeFormatted: Date;
    let meetingData: MeetingEntity;
    let response: IOnCreateMeetingResponse | null = null;

    const meetingDurationTime =
      data.meetingDuration.split(/s+/)[
        data.meetingDuration.split(/s+/).length - 1
      ];

    switch (meetingDurationTime) {
      case "minutes":
        metingDurationFormatted = new Date(
          new Date(data.meetingTime).setMinutes(
            new Date(data.meetingTime).getMinutes() + meetingDurationToNumber
          )
        );

        meetingTimeFormatted = new Date(data.meetingTime);

        meetingData = {
          _name: data.name,
          _meetingTime: meetingTimeFormatted,
          _meetingId: this.uuid.createId(),
          _meetingDuration: metingDurationFormatted,
        };

        const meeting = await this.repository.createMeeting(meetingData, user);

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

    return response as IOnCreateMeetingResponse;
  }
}
