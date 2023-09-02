import { AppError } from "@shared/errors/AppError";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

export namespace AuthenticateUserError {
  export class IncorrectEmailOrPassword extends AppError {
    constructor() {
      super("Email Or Password Incorrect", 400)
    }
  }

  export class IncorrectCpfOrPassword extends AppError {
    constructor() {
      super("Cpf Or Password Incorrect", 400)
    }
  }

  export class RequiredEmailOrCpf extends AppError {
    constructor() {
      super("Email Or Cpf Required", 400)
    }
  }
}