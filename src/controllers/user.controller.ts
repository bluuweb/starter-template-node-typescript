import { Request, Response } from "express";
import {
  UserAdapter,
  UserRepositoryPg,
  UserRepositorySequelize,
} from "../adapters/user.adapter";
import { setTokenCookie } from "../helpers/set-token-cookie";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";

const usePgRepository = false;

const userRepository = usePgRepository
  ? new UserRepositoryPg() // Selecciona el repositorio pg
  : new UserRepositorySequelize(); // Selecciona el repositorio Sequelize

const userAdapter = new UserAdapter(userRepository); // Adaptador con el repositorio elegido

export const userSignUp = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe (repositorio genérico)
    const userExist = await userAdapter.findUserByEmail(email);
    if (userExist) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Crear el usuario (repositorio genérico)
    const user = await userAdapter.createUser(username, email, password);

    // Generar el token
    const token = userAdapter.generateToken(user);

    // Establecer el token como cookie
    setTokenCookie(res, token);

    res.status(200).json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Facade Pattern
const userService = new UserService();

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Facade Pattern
    const { user, token } = await userService.login(email, password);

    setTokenCookie(res, token);

    res.status(200).json({
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    if (
      error instanceof Error &&
      (error.message === "User not found" ||
        error.message === "Invalid password")
    ) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const userLogout = async (_: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userInfo = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.user?.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Creamos un Proxy para modificar el objeto `user`
    const userProxy = new Proxy(user, {
      get(target, prop, receiver) {
        // Evitar devolver la propiedad `password`
        if (prop === "password") {
          return undefined; // No se devolverá la contraseña
        }
        return Reflect.get(target, prop, receiver); // Devuelve el valor original para otras propiedades
      },
    });

    res.status(200).json({ user: userProxy });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.user?.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const token = user.generateToken();
    setTokenCookie(res, token);

    // Utilizando el spread operator y destructuración para eliminar la propiedad `password`
    const { password: _, ...userWithoutPassword } = user.toJSON(); // `user.toJSON()` para asegurarse de que estamos obteniendo un objeto plano

    res
      .status(200)
      .json({ message: "Token refreshed", user: userWithoutPassword });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
