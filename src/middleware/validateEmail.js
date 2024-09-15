import { StatusCodes } from "http-status-codes";

const validateEmail = (request, _response, next) => {
  const { email } = request.body;

  const emailRegexp = /^[\w_.]+@[a-z]+\.[a-z]+(\.[a-z]{2})?$/;

  if (!emailRegexp.test(email))
    return next({
      message: "invalid email format",
      status: StatusCodes.BAD_REQUEST
    });

  return next();
};
export default validateEmail;
