import { Request, Response } from "express";
import { container } from "tsyringe";
import { RefreshTokenUseCase } from "./refreshTokenUseCase";

export class RefreshTokenController {
  async handle(req: Request, res: Response): Promise<Response> {
    const token = req.body.token || req.headers["x-access-token"] || req.query.token;

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

    const refreshTokenResponse = await refreshTokenUseCase.execute(token);

    return res.json(refreshTokenResponse);
  }
}