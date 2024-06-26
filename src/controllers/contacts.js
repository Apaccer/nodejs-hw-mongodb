import mongoose from 'mongoose';

import createHttpError from 'http-errors';

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { CLOUDINARY } from '../constants/constants.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};
export const getContactByIdController = async (req, res, next) => {
  const id = req.params.contactId;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const contact = await getContactById(id, req.user._id);
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
  const { body, file } = req;
  let photoUrl;

  if (file) {
    if (env(CLOUDINARY.ENABLE_CLOUDINARY) === 'true') {
      photoUrl = await saveFileToCloudinary(file);
    } else {
      photoUrl = await saveFileToUploadDir(file);
    }
  }
  const contact = await createContact(
    { ...body, photo: photoUrl },
    req.user._id,
  );

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const id = req.params.contactId;
  const { body, file } = req;
  let photoUrl;

  if (file) {
    if (env(CLOUDINARY.ENABLE_CLOUDINARY) === 'true') {
      photoUrl = await saveFileToCloudinary(file);
      console.log(true);
    } else {
      photoUrl = await saveFileToUploadDir(file);
      console.log(false);
    }
  }
  if (mongoose.Types.ObjectId.isValid(id)) {
    const result = await updateContact(
      id,
      { ...body, photo: photoUrl },
      req.user._id,
    );
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
    const contact = await deleteContact(id, req.user._id);
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
