import { StatusCodes } from "http-status-codes";

export const isRequired = (fields) => (request, response, next) => {
  fields.forEach((field) => {
    if (!request.body[field]) {
      return next({
        message: `Field ${field} is required`,
        status: StatusCodes.BAD_REQUEST
      });
    }
  });
  next();
};

export const isRequiredList = (fields) => (request, response, next) => {
  request.body.forEach((item) => {
    fields.forEach((field) => {
      if (!item[field]) {
        return next({
          message: `Field ${field} is required`,
          status: StatusCodes.BAD_REQUEST
        });
      }
    });
  });
  next();
};
