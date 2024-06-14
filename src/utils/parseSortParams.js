import { SORT_ORDER } from '../constants/constants.js';

const parseSortOrder = (sortOrder) => {
  const IsKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (IsKnownOrder) {
    return sortOrder;
  }
  return SORT_ORDER.ASC;
};
const parseSortBy = (sortBy) => {
  const keyOfContact = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'isFavourite',
    'contactType',
    'createdAt',
    'updatedAt',
  ];
  if (keyOfContact.includes(sortBy)) {
    return sortBy;
  }
  return 'name';
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  return {
    sortBy: parseSortBy(sortBy),
    sortOrder: parseSortOrder(sortOrder),
  };
};
