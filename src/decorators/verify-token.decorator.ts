// decoradores.ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyTokenDecorator = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.signedCookies.token;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!process.env.SECRET_JWT) {
        throw new Error("SECRET_JWT is not defined");
      }

      const decoded = jwt.verify(token, process.env.SECRET_JWT) as {
        id: string;
      };

      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = user;

      return fn(req, res, next); // Llama al controlador original si todo es válido
    } catch (error) {
      console.log(error);
      if ((error as Error).name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token expired, please refresh" });
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }
  };
};
