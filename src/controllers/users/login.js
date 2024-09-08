import { StatusCodes } from "http-status-codes";
import { login as loginService } from "../../services/users/index.js";

export default async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    const accessToken = await loginService({ email, password });

    response.status(StatusCodes.ACCEPTED).json({ accessToken });
  } catch (error) {
    next(error);
  }
}
