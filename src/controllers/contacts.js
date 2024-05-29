import mongoose from 'mongoose';

import createHttpError from 'http-errors';

import { getAllContacts, getContactById } from '../services/contacts.js';

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};
export const getContactByIdController = async (req, res, next) => {
  const id = req.params.contactId;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const contact = await getContactById(id);
    if (contact) {
      res.json({
        status: 200,
        message: `Successfully found contact with id ${id}!`,
        data: contact,
      });
    } else {
      next(createHttpError(404, 'Contact not found'));
      return;
    }
  } else {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
};
