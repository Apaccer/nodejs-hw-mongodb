import express from 'express';
import mongoose from 'mongoose';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';

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

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      console.log(error);
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const id = req.params.contactId;
      if (mongoose.Types.ObjectId.isValid(id)) {
        const contact = await getContactById(id);
        if (contact) {
          res.json({
            status: 200,
            message: `Successfully found contact with id ${id}!`,
            data: contact,
          });
        }
      } else {
        return res.status(404).json({
          status: 404,
          message: `Contact with id ${id} not found!`,
        });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((error, req, res, next) => {
    res.status(500).send(error.message);
  });

  const PORT = Number(env('PORT', '3000'));
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
  });
};
