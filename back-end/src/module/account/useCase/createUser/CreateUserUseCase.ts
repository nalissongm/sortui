import { hash } from "bcrypt";
import { Users } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@module/account/repositories/IUsersRepository";

interface IRequest {
  name: string;
  email: string;
  password: string;
  cpf: string;
}

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) { }
  async execute({ name, email, password, cpf }: IRequest): Promise<void> {
    const passwordHash = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
      cpf
    });
  }
}