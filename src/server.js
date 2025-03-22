import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './utils/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { rootRouter } from './routers/index.js';
import { UPLOAD_DIR } from './constants/constants.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

export const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
        options: { colorize: true },
      },
    }),
  );
  app.use(cors());

  app.use(cookieParser());

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('/api-docs', swaggerDocs());

  app.use(rootRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  const PORT = Number(env('PORT', '3000'));
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
  });
};
