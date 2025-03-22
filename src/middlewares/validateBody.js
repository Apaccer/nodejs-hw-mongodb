import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    if (req.body.isFavourite === 'true') {
      req.body.isFavourite = true;
    } else if (req.body.isFavourite === 'false') {
      req.body.isFavourite = false;
    }
    await schema.validateAsync(req.body, {
      abortEarly: false,
      convert: false,
    });
    next();
  } catch (err) {
    const error = createHttpError(400, 'Bad request', {
      errors: err.details,
    });
    next(error);
  }
};
