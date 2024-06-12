import { UserEntity } from "../entity/auth.entity";
import { IMeetingServiceOnCreateMeetingParams } from "./meeting.interface";

export interface IAuthCreateAccountParameters {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  currentLevel: string;
  course: string;
  semester: string;
  role: string;
}

export interface IAuthLoginAccountParameters {
  username: string;
  password: string;
}

interface IAuthCreateAccountResponseBodySuccessData {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  currentLevel: string;
  semester: string;
  course: string;
  role: string;
  access_token: string;
}

interface IAuthLoginAccountResponseBodySuccessData
  extends IAuthCreateAccountResponseBodySuccessData {
  refresh_token: string;
}

interface IAuthCreateAccountResponseBody {
  status: "success" | "fail";
  message: string;
  data?: IAuthCreateAccountResponseBodySuccessData;
}

export type TAuthLoginResponseBody = Omit<
  IAuthCreateAccountResponseBody,
  "data"
> & {
  data?: IAuthLoginAccountResponseBodySuccessData;
};

export interface IAuthCreateAccountResponse {
  statusCode: number;
  body: IAuthCreateAccountResponseBody;
}

export interface IAuthLoginAccountResponse {
  statusCode: number;
  body: TAuthLoginResponseBody;
}

export interface IAuthService {
  onCreateAccount(
    data: IAuthCreateAccountParameters
  ): Promise<IAuthCreateAccountResponse>;

  onLogin(
    data: IAuthLoginAccountParameters
  ): Promise<IAuthLoginAccountResponse>;

  onUpdatePassword(
    data: IAuthUpdateAccountParameters,
    user: string
  ): Promise<IAuthCreateAccountResponse>;
}

export interface IAuthRepositoryFindUserParameters {
  email?: string;
  id?: string;
  username?: string;
}

export interface IAuthRepository {
  findUser(data: IAuthRepositoryFindUserParameters): Promise<UserEntity | null>;
  createUser(data: IAuthCreateAccountParameters): Promise<void>;
  updateUser(data: { user: string; password: string }): Promise<void>;
}

export interface IAuthUpdateAccountParameters {
  password: string;
}

type IValidatorParameters =
  | IAuthCreateAccountParameters
  | IAuthLoginAccountParameters
  | IAuthUpdateAccountParameters
  | IMeetingServiceOnCreateMeetingParams;

export interface IValidator {
  validateData(data: IValidatorParameters, schema: Zod.Schema): boolean;
}

export interface IBcrypt {
  hash(password: string): Promise<string>;
  confirmPassword(
    inputPassword: string,
    userPassword: string
  ): Promise<boolean>;
}

export interface IJWTParameters {
  tokenData:
    | (IAuthCreateAccountParameters & { username: string })
    | { email: string };
  tokenSecret: string;
  expiresIn: string;
}

export interface IJWT {
  createToken(data: IJWTParameters): string;
}
