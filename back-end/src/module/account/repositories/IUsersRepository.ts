import { Users } from "@prisma/client";
import { ICreateUserDTO } from "../dto/createUserDTO";

export interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<Users>;
  findByEmail(email: string): Promise<Users | null>;
  findByCpf(cpf: string): Promise<Users | null>;
  findById(id: string): Promise<Users | null>;
}