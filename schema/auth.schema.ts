import { Level, Role, Semester, Course } from "@prisma/client";
import { z } from "zod";

export const CreateAccountSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  currentLevel: z.nativeEnum(Level),
  semester: z.nativeEnum(Semester),
  course: z.nativeEnum(Course),
  role: z.nativeEnum(Role),
});

export const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
