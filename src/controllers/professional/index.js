import { StatusCodes } from "http-status-codes";

export default class ProfessionalController {
  constructor(professionalService) {
    this.service = professionalService;
    this.create = this.create.bind(this);
  }
  async create(request, response, next) {
    try {
      const { body, user } = request;
      await this.service.create(user.id, body);
      response.status(StatusCodes.CREATED).end();
    } catch (error) {
      next(error);
    }
  }
}
