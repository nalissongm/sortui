import { Prisma, PrismaClient, UserTokens } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { ICreateUserTokensDTO } from "@module/account/dto/createUserTokensDTO";
import { IUserTokensRepository } from "@module/account/repositories/IUserTokensRepository";

export class UserTokensRepository implements IUserTokensRepository {
  private repository: Prisma.UserTokensDelegate<any>;

  constructor() {
    this.repository = new PrismaClient().userTokens;
  }
  async create({ expires_date, refresh_token, user_id }: ICreateUserTokensDTO): Promise<UserTokens> {
    const userToken = await this.repository.create({
      data: {
        expires_date,
        refresh_token,
        user: {
          connect: {
            id: user_id,
          }
        }
      }
    });

    return userToken;
  }

  async findByUserIdAndRefreshToken(user_id: string, token: string): Promise<UserTokens> {
    const userToken = await this.repository.findFirst({
      where: {
        user: {
          id: user_id
        },
        AND: {
          refresh_token: token
        }
      }
    })

    return userToken as UserTokens;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({
      where: {
        id
      }
    })
  }

}