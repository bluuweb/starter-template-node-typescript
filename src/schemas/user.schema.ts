import { Schema } from "express-validator";

export const signupSchema: Schema = {
  username: {
    in: ["body"],
    isString: true,
    isLength: {
      errorMessage: "Username must be at least 3 characters long",
      options: { min: 3 },
    },
  },
  email: {
    in: ["body"],
    isEmail: true,
  },
  password: {
    in: ["body"],
    isLength: {
      errorMessage: "Password must be at least 6 characters long",
      options: { min: 6 },
    },
  },
};

export const loginSchema: Schema = {
  email: {
    in: ["body"],
    isEmail: true,
  },
  password: {
    in: ["body"],
    isLength: {
      errorMessage: "Password must be at least 6 characters long",
      options: { min: 6 },
    },
  },
};
