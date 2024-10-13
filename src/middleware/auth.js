import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const auth = (request, response, next) => {
  const { authorization: token } = request.headers;

  const secret = process.env.SECRET;

  if (!token) {
    return next({
      status: StatusCodes.UNAUTHORIZED,
      message: "User not authenticated"
    });
  }

  const decoded = jwt.verify(token, secret);

  request.user = decoded;

  next();
};

