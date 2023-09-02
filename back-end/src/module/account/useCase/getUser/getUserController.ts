import { Request, response, Response } from "express";
import { container } from "tsyringe";
import { UserMapper } from "../mappers/userMapper";
import { GetUserUseCase } from "./getUserUseCase";

export class GetUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;

    const getUserUseCase = container.resolve(GetUserUseCase);

    const user = await getUserUseCase.execute(id);

    const userDTO = UserMapper.toDTO(user);

    return res.json(userDTO);
  }
}