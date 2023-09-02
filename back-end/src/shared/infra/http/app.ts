import express, { NextFunction, Request, Response } from "express";

import "express-async-errors";
import "reflect-metadata";
import "@shared/container";
import cors from "cors";

import { router } from "./routes";
import { AppError } from "@shared/errors/AppError";


const app = express();

app.use(express.json());

app.use(cors())

app.use(router);

app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message
    })
  }

  return res.status(500).json({
    status: "error",
    message: `Internal Server Error -> ${err.message}`,
  })
})

export { app };
