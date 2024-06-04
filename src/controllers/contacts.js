import mongoose from 'mongoose';

import createHttpError from 'http-errors';

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

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

export const createContsctController = async (req, res) => {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const id = req.params.contactId;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const result = await updateContact(id, req.body);
    if (result) {
      res.json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: result,
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

export const deleteContactController = async (req, res, next) => {
  const id = req.params.contactId;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const contact = await deleteContact(id);
    if (contact) {
      res.status(204).send();
    } else {
      next(createHttpError(404, 'Contact not found'));
      return;
    }
  } else {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
};
