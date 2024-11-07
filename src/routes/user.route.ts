import { Router } from "express";
import {
  refreshToken,
  userInfo,
  userLogin,
  userLogout,
  userSignUp,
} from "../controllers/user.controller";
import { verifyTokenDecorator } from "../decorators/verify-token.decorator";
import { verifyToken } from "../middlewares/token.middleware";
import { validate } from "../middlewares/validator.middleware";
import { loginSchema, signupSchema } from "../schemas/user.schema";

const router = Router();

router.post("/signup", validate(signupSchema), userSignUp);
router.post("/login", validate(loginSchema), userLogin);
router.get("/logout", verifyToken, userLogout);

// Decorator Pattern
router.get("/me", verifyTokenDecorator(userInfo));

router.get("/refresh-token", verifyToken, refreshToken);

export default router;
