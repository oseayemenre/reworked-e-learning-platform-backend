import { inject, injectable } from "inversify";

import {
  IAuthCreateAccountParameters,
  IAuthCreateAccountResponse,
  IAuthService,
  IBcrypt,
  IJWT,
  IAuthRepository,
  IValidator,
  IAuthLoginAccountParameters,
  IAuthLoginAccountResponse,
} from "../interface/auth.interface";

import {
  CreateAccountSchema,
  LoginSchema,
  UpdatePasswordSchema,
} from "../schema/auth.schema";

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../utils/secret";

import { INTERFACE_TYPE } from "../utils/constants";

@injectable()
export class AuthService implements IAuthService {
  private readonly validator;
  private readonly repository;
  private readonly bcrypt;
  private readonly jwt;

  constructor(
    @inject(INTERFACE_TYPE.IVALIDATOR) validator: IValidator,
    @inject(INTERFACE_TYPE.AUTHREPOSITORY) repository: IAuthRepository,
    @inject(INTERFACE_TYPE.BCRYPT) bcrypt: IBcrypt,
    @inject(INTERFACE_TYPE.JWT) jwt: IJWT
  ) {
    (this.validator = validator),
      (this.repository = repository),
      (this.bcrypt = bcrypt),
      (this.jwt = jwt);
  }

  public async onLogin(
    data: IAuthLoginAccountParameters
  ): Promise<IAuthLoginAccountResponse> {
    const valid = this.validator.validateData(data, LoginSchema);

    if (!valid)
      return {
        statusCode: 400,
        body: {
          status: "fail",
          message: "Input could not be validated",
        },
      };

    const user = await this.repository.findUser({ username: data.username });

    if (!user)
      return {
        statusCode: 401,
        body: {
          status: "fail",
          message: "User not found",
        },
      };

    const confirmPassword = await this.bcrypt.confirmPassword(
      data.password,
      user._password
    );

    if (!confirmPassword)
      return {
        statusCode: 401,
        body: {
          status: "fail",
          message: "User credentials is incorrect",
        },
      };

    const access_token = this.jwt.createToken({
      tokenData: { email: user._email },
      tokenSecret: ACCESS_TOKEN_SECRET,
      expiresIn: "15m",
    });

    const refresh_token = this.jwt.createToken({
      tokenData: { email: user._email },
      tokenSecret: REFRESH_TOKEN_SECRET,
      expiresIn: "1d",
    });

    return {
      statusCode: 200,
      body: {
        status: "success",
        message: "User succesfully logged in",
        data: {
          username: user._username,
          email: user._email,
          password: user._password,
          firstname: user._firstname,
          lastname: user._lastname,
          currentLevel: user._currentLevel,
          semester: user._semester,
          course: user._course,
          role: user._role,
          access_token: access_token,
          refresh_token: refresh_token,
        },
      },
    };
  }

  public async onCreateAccount(
    data: IAuthCreateAccountParameters
  ): Promise<IAuthCreateAccountResponse> {
    const valid = this.validator.validateData(data, CreateAccountSchema);

    if (!valid)
      return {
        statusCode: 400,
        body: {
          status: "fail",
          message: "Input could not be validated",
        },
      };

    const user = await this.repository.findUser({ email: data.email });

    if (user)
      return {
        statusCode: 409,
        body: {
          status: "fail",
          message: "User already exists",
        },
      };

    const hashPassword = await this.bcrypt.hash(data.password);

    const username =
      data.email.split("@")[0] + Math.floor(1000 + Math.random() * 8999);

    const userData = {
      username: username,
      email: data.email,
      password: hashPassword,
      firstname: data.firstname,
      lastname: data.lastname,
      currentLevel: data.currentLevel,
      semester: data.semester,
      course: data.course,
      role: data.role,
    };

    //implement otp

    await this.repository.createUser(userData);

    const token = this.jwt.createToken({
      tokenData: userData,
      tokenSecret: ACCESS_TOKEN_SECRET,
      expiresIn: "15m",
    });

    return {
      statusCode: 201,
      body: {
        status: "success",
        message: "User succesfully created",
        data: { ...userData, access_token: token },
      },
    };
  }

  public async onUpdatePassword(
    data: {
      password: string;
    },
    user: string
  ): Promise<IAuthCreateAccountResponse> {
    const valid = this.validator.validateData(data, UpdatePasswordSchema);

    if (!valid)
      return {
        statusCode: 400,
        body: {
          status: "fail",
          message: "Input could not be validated",
        },
      };

    const searchUser = await this.repository.findUser({ email: user });

    const passwordUsed = await this.bcrypt.confirmPassword(
      data.password,
      searchUser?._password as string
    );

    if (passwordUsed)
      return {
        statusCode: 409,
        body: {
          status: "fail",
          message: "Password has already been used by you before",
        },
      };

    const hashedPassword = await this.bcrypt.hash(data.password);

    await this.repository.updateUser({ user: user, password: hashedPassword });

    return {
      statusCode: 200,
      body: {
        status: "success",
        message: "User password has been updated",
      },
    };
  }
}
