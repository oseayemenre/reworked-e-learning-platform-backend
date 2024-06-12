import { z } from "zod";

export const CreateMeetingSchema = z.object({
  name: z.string().min(1),
  meetingTime: z.string().min(1),
  meetingDuration: z.string().min(1),
});
