import { Router } from 'express';
import contactRouter from './contacts.js';
import authRouter from './auth.js';

export const rootRouter = Router();

rootRouter.use('/contacts', contactRouter);
rootRouter.use('/auth', authRouter);
