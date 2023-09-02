import { auth } from "@config/auth";
import { IUserTokensRepository } from "@module/account/repositories/IUserTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

interface IPayload {
  email: string;
  sub: string;
}

interface IRefreshTokenResponse {
  token: string;
  refresh_token: string;
}


@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DayjsProvider")
    private dateProvider: IDateProvider
  ) { }

  async execute(token: string): Promise<IRefreshTokenResponse> {
    console.log("Passou no verify", token);
    const { email, sub } = verify(token, auth.secret_refresh_token) as IPayload;


    const user_id = sub;

    const userToken = await this.userTokensRepository.findByUserIdAndRefreshToken(user_id, token);

    if (!userToken) {
      throw new AppError("Refresh token not exist")
    }

    await this.userTokensRepository.deleteById(userToken.id);

    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: sub,
      expiresIn: auth.expires_in_refresh_token
    });

    const expires_date = this.dateProvider.addDays(auth.expires_refresh_token_days);

    await this.userTokensRepository.create({
      expires_date,
      refresh_token,
      user_id
    });

    const new_token = sign({}, auth.secret_token, {
      subject: user_id,
      expiresIn: auth.expires_in_token
    })

    return {
      token: new_token,
      refresh_token
    }
  }
}