import { AuthenticateUserController } from "@module/account/useCase/authenticateUser/AuthenticateUserController";
import { RefreshTokenController } from "@module/account/useCase/refreshToken/refreshTokenController";
import { Router } from "express";

const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();

const authenticateRoutes = Router();

authenticateRoutes.post("/", authenticateUserController.handle);
authenticateRoutes.post("/refresh-token", refreshTokenController.handle)

export { authenticateRoutes };