const parseNumber = (number, defaultValue) => {
  if (typeof number !== 'string') {
    return defaultValue;
  }
  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) {
    return defaultValue;
  }
  return parsedNumber;
};

export const parsePaginationParams = (params) => {
  const { page, perPage } = params;
  return {
    page: parseNumber(page, 1),
    perPage: parseNumber(perPage, 10),
  };
};
