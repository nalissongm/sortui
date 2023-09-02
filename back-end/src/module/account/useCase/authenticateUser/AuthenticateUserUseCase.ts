import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { Users } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { AuthenticateUserError } from "./AuthenticateUserError";

import { IUsersRepository } from "@module/account/repositories/IUsersRepository";
import { auth } from "@config/auth";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IUserTokensRepository } from "@module/account/repositories/IUserTokensRepository";

interface IRequest {
  email?: string;
  cpf?: string;
  password: string;
}

interface IResponse {
  token: string;
  user: {
    name: string;
    email: string;
  },
  refresh_token: string;
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("DayjsProvider")
    private dateProvider: IDateProvider,
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository
  ) { }
  async execute({ email, cpf, password }: IRequest): Promise<IResponse> {
    if (!email && !cpf) {
      throw new AuthenticateUserError.RequiredEmailOrCpf();
    }

    const user: Users | null = email ? await this.usersRepository.findByEmail(email) : cpf ? await this.usersRepository.findByCpf(cpf) : null;

    if (!user) {
      if (!cpf) throw new AuthenticateUserError.IncorrectEmailOrPassword();

      throw new AuthenticateUserError.IncorrectCpfOrPassword();
    }

    const isMatchPassword = await compare(password, user.password);

    if (!isMatchPassword) {
      if (!cpf) throw new AuthenticateUserError.IncorrectEmailOrPassword();

      throw new AuthenticateUserError.IncorrectCpfOrPassword();
    }

    const token = sign({}, auth.secret_token, {
      subject: user.id,
      expiresIn: auth.expires_in_token
    })

    const expires_date = this.dateProvider.addDays(auth.expires_refresh_token_days);

    const refresh_token = sign({ email: user.email }, auth.secret_refresh_token, {
      subject: user.id,
      expiresIn: auth.expires_in_refresh_token
    })

    await this.userTokensRepository.create({
      refresh_token,
      expires_date,
      user_id: user.id,
    })

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email
      },
      refresh_token
    }

    return tokenReturn;
  }
}