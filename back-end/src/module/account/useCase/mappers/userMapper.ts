import { Users } from "@prisma/client";

export class UserMapper {
  static toDTO({ id, name, cpf, email, created_at, updated_at }: Users) {
    return { id, name, cpf, email, created_at, updated_at };
  }
}