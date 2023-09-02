import { ICreateUserDTO } from "@module/account/dto/createUserDTO";
import { IUsersRepository } from "@module/account/repositories/IUsersRepository";
import { Prisma, PrismaClient, Users } from "@prisma/client";

export class UsersRepository implements IUsersRepository {
  private repository: Prisma.UsersDelegate<any>;

  constructor() {
    this.repository = new PrismaClient().users;
  }

  async create(data: ICreateUserDTO): Promise<Users> {
    const user = await this.repository.create({
      data
    });

    return user;
  }

  async findByEmail(email: string): Promise<Users | null> {
    const user = await this.repository.findFirst({
      where: {
        email
      }
    })

    return user;
  }

  async findByCpf(cpf: string): Promise<Users | null> {
    const user = await this.repository.findFirst({
      where: {
        cpf
      }
    })

    return user;
  }

  async findById(id: string): Promise<Users | null> {
    const user = await this.repository.findFirst({
      where: {
        id
      }
    })

    return user;
  }
}