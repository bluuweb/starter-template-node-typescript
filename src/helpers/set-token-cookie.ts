import { Response } from "express";
import jwt from "jsonwebtoken";

export const setTokenCookie = (res: Response, token: string) => {
  const decodedToken = jwt.decode(token) as jwt.JwtPayload;

  if (!decodedToken || !decodedToken.exp) {
    throw new Error("Invalid token");
  }

  const tokenExpiration = decodedToken.exp * 1000; // Convertir a milisegundos
  const cookieExpiration = new Date(tokenExpiration + 3600000); // Sumar una hora

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: cookieExpiration,
    signed: true,
  });
};
