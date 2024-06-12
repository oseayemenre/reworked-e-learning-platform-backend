import { PrismaClient } from "@prisma/client";
import { MeetingEntity } from "../entity/meeting.entity";
import { IMeetingRepository } from "../interface/meeting.interface";

export class MeetingRepository implements IMeetingRepository {
  private readonly prisma;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createMeeting(
    data: MeetingEntity,
    user: string
  ): Promise<MeetingEntity> {
    const meeting = await this.prisma.meeting.create({
      data: {
        name: data._name,
        meetingId: data._meetingId,
        meetingDuration: data._meetingDuration,
        meetingTime: data._meetingTime,
      },
    });

    return {
      _name: meeting.name,
      _meetingDuration: meeting.meetingDuration,
      _meetingId: data._meetingId,
      _meetingTime: data._meetingTime,
    };
  }
}
