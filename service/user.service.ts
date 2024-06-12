import { inject } from "inversify";
import { IAuthRepository } from "../interface/auth.interface";
import {
  IUserService,
  IUserServiceResponse,
} from "../interface/user.interface";
import { INTERFACE_TYPE } from "../utils/constants";

export class UserService implements IUserService {
  private readonly repository;

  constructor(
    @inject(INTERFACE_TYPE.AUTHREPOSITORY) repository: IAuthRepository
  ) {
    this.repository = repository;
  }

  public async onGetUser(email: string): Promise<IUserServiceResponse> {
    const user = await this.repository.findUser({ email: email });

    return {
      statusCode: 200,
      body: {
        status: "success",
        message: "User data found",
        data: {
          _username: user?._username as string,
          _email: user?._email as string,
          _password: user?._password as string,
          _firstname: user?._firstname as string,
          _lastname: user?._lastname as string,
          _currentLevel: user?._currentLevel as string,
          _semester: user?._semester as string,
          _course: user?._course as string,
          _role: user?._role as string,
        },
      },
    };
  }
}
