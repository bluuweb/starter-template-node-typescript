// src/adapters/UserAdapter.ts
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model"; // Modelo Sequelize

export interface UserRepository {
  findUserByEmail(email: string): Promise<User | null>;
  createUser(username: string, email: string, password: string): Promise<User>;
}

export class UserRepositorySequelize implements UserRepository {
  async findUserByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  async createUser(username: string, email: string, password: string) {
    const user = await User.create({ username, email, password });
    return user;
  }
}

import { db } from "../database/pg-example"; // Conexión pg

export class UserRepositoryPg implements UserRepository {
  async findUserByEmail(email: string) {
    const { rows: user } = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return (user as unknown as User) || null;
  }

  async createUser(username: string, email: string, password: string) {
    const { rows: user } = await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, password]
    );
    return user as unknown as User;
  }
}

// Adapter Pattern

export class UserAdapter {
  constructor(private userRepository: UserRepository) {}

  async validatePassword(user: any, password: string): Promise<boolean> {
    return bcryptjs.compare(password, user.password);
  }

  generateToken(user: any): string {
    if (!process.env.SECRET_JWT) {
      throw new Error("SECRET_JWT is not defined");
    }
    return jwt.sign({ id: user.id }, process.env.SECRET_JWT, {
      expiresIn: "1h",
    });
  }

  // Métodos delegados al repositorio
  async findUserByEmail(email: string) {
    return this.userRepository.findUserByEmail(email);
  }

  async createUser(username: string, email: string, password: string) {
    return this.userRepository.createUser(username, email, password);
  }
}
