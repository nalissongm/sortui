import { UsersRepository } from "@module/account/infra/prisma/repositories/UsersRepository";
import { IUsersRepository } from "@module/account/repositories/IUsersRepository";
import { container } from "tsyringe";

import "@shared/container/providers";
import { IUserTokensRepository } from "@module/account/repositories/IUserTokensRepository";
import { UserTokensRepository } from "@module/account/infra/prisma/repositories/UserTokensRepository";

container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepository);
container.registerSingleton<IUserTokensRepository>("UserTokensRepository", UserTokensRepository);