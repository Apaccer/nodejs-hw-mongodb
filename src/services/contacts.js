import { Contacts } from '../db/Contact.js';

export const getAllContacts = async () => {
  return await Contacts.find();
};

export const getContactById = async (id) => {
  return await Contacts.findById(id);
};

export const createContact = async (payload) => {
  return await Contacts.create(payload);
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await Contacts.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId) => {
  const contact = await Contacts.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};
