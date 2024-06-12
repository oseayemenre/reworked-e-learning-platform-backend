import { UserEntity } from "../entity/auth.entity";

export interface IUserServiceResponseBody {
  status: string;
  message: string;
  data: UserEntity;
}

export interface IUserServiceResponse {
  statusCode: number;
  body: IUserServiceResponseBody;
}

export interface IUserService {
  onGetUser(email: string): Promise<IUserServiceResponse>;
}
