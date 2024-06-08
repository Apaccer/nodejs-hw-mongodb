const parseType = (type) => {
  if (typeof type !== 'string') return;

  const isType = ['work', 'home', 'personal'].includes(type);
  if (isType) return type;
};

const parseIsFavorite = (bool) => {
  if (!['true', 'false'].includes(bool)) return;

  return bool === 'true' ? true : false;
};

export const parseFilterParams = (query) => {
  const { isFavourite, contactType } = query;

  const parsedType = parseType(contactType);
  const parsedIsFavorite = parseIsFavorite(isFavourite);
  return {
    type: parsedType,
    isFavourite: parsedIsFavorite,
  };
};
