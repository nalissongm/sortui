import { UserTokens } from "@prisma/client";
import { ICreateUserTokensDTO } from "../dto/createUserTokensDTO";

export interface IUserTokensRepository {
  create(data: ICreateUserTokensDTO): Promise<UserTokens>;
  findByUserIdAndRefreshToken(userId: string, token: string): Promise<UserTokens>;
  deleteById(id: string): Promise<void>;
}