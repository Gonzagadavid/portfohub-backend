import { StatusCodes } from "http-status-codes";

export default class UserController {
  constructor(userService) {
    this.service = userService;
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  async register(request, response, next) {
    const { fullName, email, password } = request.body;

    try {
      await this.service.register({ fullName, email, password });
    } catch (error) {
      return next(error);
    }

    response.status(StatusCodes.CREATED).end();
  }

  async login(request, response, next) {
    console.log(request.body);
    const { email, password } = request.body;

    try {
      const accessToken = await this.service.login({ email, password });

      response.status(StatusCodes.ACCEPTED).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
}
