import { CreateUserController } from "@module/account/useCase/createUser/CreateUserController";
import { GetUserController } from "@module/account/useCase/getUser/getUserController";
import { Request, Response, Router } from "express";
import { ensureAuthenticate } from "../middlewares/ensureAuthenticate";

const createUserController = new CreateUserController();
const getUserController = new GetUserController();

const usersRoutes = Router()

usersRoutes.post("/", createUserController.handle);
usersRoutes.get("/profile", ensureAuthenticate, getUserController.handle)

export { usersRoutes };