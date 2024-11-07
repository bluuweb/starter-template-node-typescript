import { NextFunction, Request, Response } from "express";
import { checkSchema, Schema, validationResult } from "express-validator";

export const validate = (schema: Schema) => {
  const validationMiddleware = checkSchema(schema);
  return async (req: Request, res: Response, next: NextFunction) => {
    // Ejecuta las validaciones del esquema
    await Promise.all(
      validationMiddleware.map((validator) => validator.run(req))
    );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  };
};
