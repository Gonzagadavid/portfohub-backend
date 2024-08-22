import { StatusCodes } from "http-status-codes";
import { userRegister as userRegisterService } from "../../services/users/index.js";

export default async function userRegister(request, response, next) {
  const { fullName, email, password } = request.body;

  try {
    await userRegisterService({ fullName, email, password });
  } catch (error) {
    return next(error);
  }

  response.status(StatusCodes.CREATED).end();
}
