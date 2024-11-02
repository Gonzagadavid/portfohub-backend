import { StatusCodes } from "http-status-codes";

export const minLength = (minLength, key) => (request, _response, next) => {
  const property = key ? request.body[key] : request.body;
  if (property.length < minLength) {
    next({
      message: `Is required min length ${minLength} to list`,
      status: StatusCodes.BAD_REQUEST
    });
  }
  next();
};

