import { StatusCodes } from "http-status-codes";
import professionalService from "../../services/professional/index.js";

export default async function professional(request, response, next) {
  try {
    const { body, user } = request;
    await professionalService(user.id, body);
    response.status(StatusCodes.CREATED).end();
  } catch (error) {
    next(error);
  }
}
