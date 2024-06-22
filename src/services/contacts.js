import { SORT_ORDER } from '../constants/constants.js';
import { Contacts } from '../db/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = perPage * (page - 1);
  const contactsQuery = Contacts.find();

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (typeof filter.isFavourite !== 'undefined') {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  contactsQuery.where('userId').equals(userId);

  const [contactsCount, contacts] = await Promise.all([
    Contacts.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return { data: contacts, ...paginationData };
};

export const getContactById = async (id, userId) => {
  return await Contacts.findOne({
    _id: id,
    userId,
  });
};

export const createContact = async (payload, userId) => {
  const contact = await Contacts.create({ ...payload, userId });
  return contact;
};

export const updateContact = async (
  contactId,
  payload,
  userId,
  options = {},
) => {
  const rawResult = await Contacts.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult || !rawResult.value) return null;

  return rawResult.value;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contacts.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};
