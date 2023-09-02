import { IUsersRepository } from "@module/account/repositories/IUsersRepository";
import { Users } from "@prisma/client";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUserUseCase {
  constructor(
    @inject("UsersRepository")
    private userRepository: IUsersRepository
  ) { }

  async execute(id: string): Promise<Users> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found");
    }

    return user;
  }
}