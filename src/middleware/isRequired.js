import { StatusCodes } from "http-status-codes";

export const isRequired = (fields) => (request, response, next) => {
  const invalidField = fields.reduce((invalid, field) => {
    if (!invalid && !request.body[field]) {
      return field;
    }
    return invalid;
  }, null);

  return invalidField
    ? next({
        message: `Field ${invalidField} is required`,
        status: StatusCodes.BAD_REQUEST
      })
    : next();
};
