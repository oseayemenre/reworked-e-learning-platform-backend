import { MeetingEntity } from "../entity/meeting.entity";

export interface IMeetingServiceOnCreateMeetingParams {
  name: string;
  meetingTime: string;
  meetingDuration: string;
}

export interface IMeetingService {
  onCreateMeeting(
    data: IMeetingServiceOnCreateMeetingParams,
    user: string
  ): Promise<any>;
}

export interface IMeetingRepository {
  createMeeting(data: MeetingEntity, user: string): Promise<MeetingEntity>;
}

export interface IOnCreateMeetingResponseBody {
  status: "success" | "failed";
  message: string;
  data?: MeetingEntity;
}

export interface IOnCreateMeetingResponse {
  statusCode: number;
  body: IOnCreateMeetingResponseBody;
}

export interface IUUID {
  createId(): string;
}
