// src/services/UserService.ts
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export class UserService {
  // Buscar usuario por email
  async findUserByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  // Crear un nuevo usuario
  async createUser(username: string, email: string, password: string) {
    const hashedPassword = await bcryptjs.hash(password, 10);
    return User.create({ username, email, password: hashedPassword });
  }

  // Generar token JWT para el usuario
  generateToken(user: User): string {
    if (!process.env.SECRET_JWT) {
      throw new Error("SECRET_JWT is not defined");
    }
    return jwt.sign({ id: user.id }, process.env.SECRET_JWT, {
      expiresIn: "1h",
    });
  }

  // Validar la contraseña del usuario
  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcryptjs.compare(password, user.password);
  }

  // Buscar usuario por ID
  async findUserById(id: number) {
    return User.findByPk(id);
  }

  // Método login que combina la lógica de búsqueda, validación de contraseña y generación de token
  async login(email: string, password: string) {
    // Buscar el usuario por email
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Validar la contraseña
    const isValid = await this.validatePassword(user, password);
    if (!isValid) {
      throw new Error("Invalid password");
    }

    // Generar token
    const token = this.generateToken(user);
    return { user, token };
  }
}
