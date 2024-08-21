import { StatusCodes } from "http-status-codes";
import { userRegister as userRegisterService } from "../../services/users/index.js";

export default async function userRegister(request, response, next) {
  const { name, email, password } = request.body;

  try {
    await userRegisterService({ name, email, password });
  } catch (error) {
    return next(error);
  }

  response.status(StatusCodes.CREATED).end();
}
