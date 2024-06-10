import { injectable } from "inversify";
import { UserEntity } from "../entity/auth.entity";
import {
  IAuthCreateAccountParameters,
  IAuthRepository,
  IAuthRepositoryFindUserParameters,
} from "../interface/auth.interface";

import { Course, Level, PrismaClient, Role, Semester } from "@prisma/client";

@injectable()
export class AuthRepository implements IAuthRepository {
  private readonly prisma;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async findUser(
    data: IAuthRepositoryFindUserParameters
  ): Promise<UserEntity | null> {
    let response: UserEntity | null = null;

    switch (true) {
      case data.hasOwnProperty("email"):
        const userByEmail = await this.prisma.user.findUnique({
          where: {
            email: data.email,
          },
        });

        if (!userByEmail) return null;

        response = {
          _username: userByEmail?.username as string,
          _email: userByEmail?.email as string,
          _password: userByEmail?.password as string,
          _firstname: userByEmail?.firstName as string,
          _lastname: userByEmail.lastName as string,
          _currentLevel: userByEmail.currentLevel as string,
          _semester: userByEmail.semester as string,
          _course: userByEmail.course as string,
          _role: userByEmail.course as string,
        };
        break;

      case data.hasOwnProperty("username"):
        const userByUsername = await this.prisma.user.findFirst({
          where: {
            username: data.username,
          },
        });

        if (!userByUsername) return null;

        response = {
          _username: userByUsername?.username as string,
          _email: userByUsername?.email as string,
          _password: userByUsername?.password as string,
          _firstname: userByUsername?.password as string,
          _lastname: userByUsername?.lastName as string,
          _currentLevel: userByUsername?.lastName as string,
          _semester: userByUsername?.semester as string,
          _course: userByUsername?.course as string,
          _role: userByUsername?.role as string,
        };
        break;

      case data.hasOwnProperty("password"):
        const userById = await this.prisma.user.findUnique({
          where: {
            id: data.id,
          },
        });

        if (!userById) return null;

        response = {
          _username: userById?.username as string,
          _email: userById?.email as string,
          _password: userById?.password as string,
          _firstname: userById?.firstName as string,
          _lastname: userById?.lastName as string,
          _currentLevel: userById?.currentLevel as string,
          _semester: userById?.semester as string,
          _course: userById?.course as string,
          _role: userById?.course as string,
        };
        break;
    }

    return response;
  }

  public async createUser(
    data: IAuthCreateAccountParameters & { username: string }
  ): Promise<void> {
    await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstname,
        lastName: data.lastname,
        currentLevel: data.currentLevel as Level,
        semester: data.semester as Semester,
        course: data.course as Course,
        role: data.role as Role,
      },
    });
  }
}
