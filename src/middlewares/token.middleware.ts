import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.signedCookies.token;

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!process.env.SECRET_JWT) {
      throw new Error("SECRET_JWT is not defined");
    }

    const decoded = jwt.verify(token, process.env.SECRET_JWT) as { id: string };

    const user = await User.findByPk(decoded.id);

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    if ((error as Error).name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired, please refresh" });
    } else {
      console.log(error);
      res.status(401).json({ message: "Unauthorized" });
    }
    return;
  }
};
