import { auth } from "@config/auth";
import { AppError } from "@shared/errors/AppError";
import { NextFunction, request, Request, Response } from "express";
import { verify, TokenExpiredError } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token missing", 401);
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    throw new AppError("Token missing", 401);
  }

  try {
    const { sub: user_id } = verify(token, auth.secret_token) as IPayload;

    req.user = {
      id: user_id,
    }

    next()
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new AppError("Token expired", 401);
    }

    throw new AppError("Token is invalid");
  }
}