import { StatusCodes } from "http-status-codes";

export const handlerError = (error, request, response, _next) => {
  const status = error?.status ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const message = error.message ?? "Internal Error";

  response.status(status).json({ message });
};
