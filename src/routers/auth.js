import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema } from '../validation/registerUserSchema.js';
import {
  loginUserController,
  logoutController,
  refreshUserSessionController,
  registerUserController,
} from '../controllers/auth.js';
import { loginUserSchema } from '../validation/loginUserSchema.js';
import { authenticate } from '../middlewares/authenticate.js';
const authRouter = Router();

authRouter.use('/logout', authenticate);
authRouter.use('/refresh', authenticate);

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post('/logout', ctrlWrapper(logoutController));

authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));

export default authRouter;
