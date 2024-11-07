import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { DataTypes, Model } from "sequelize";
import sequelize from "../database";

const validPasswordMixin = {
  validPassword(this: User, password: string): Promise<boolean> {
    return bcryptjs.compare(password, this.password);
  },
};

const generateTokenMixin = {
  generateToken(this: User): string {
    if (!process.env.SECRET_JWT) {
      throw new Error("SECRET_JWT is not defined");
    }
    return jwt.sign({ id: this.id }, process.env.SECRET_JWT, {
      expiresIn: "1h",
    });
  },
};

export class User extends Model {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare role: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Declaración de los métodos que se añadirán con mixins
  validPassword!: (password: string) => Promise<boolean>;
  generateToken!: () => string;
}

Object.assign(User.prototype, validPasswordMixin, generateTokenMixin);

// Factory Pattern
User.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 150], // Mínimo 3 caracteres, máximo 150 caracteres
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Validar que sea un email válido
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 15], // Mínimo 6 caracteres
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: [["user", "admin"]],
      },
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

// Revealing Module Pattern
User.addHook("beforeCreate", async (user: User) => {
  // Decorator Pattern
  const hash = await bcryptjs.hash(user.getDataValue("password"), 10);
  user.setDataValue("password", hash);
});

// Revealing Module Pattern
User.addHook("beforeUpdate", async (user: User) => {
  const hash = await bcryptjs.hash(user.getDataValue("password"), 10);
  user.setDataValue("password", hash);
});
