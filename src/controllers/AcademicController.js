import { StatusCodes } from "http-status-codes";

export default class AcademicController {
  constructor(academicService) {
    this.service = academicService;
    this.create = this.create.bind(this);
    this.getByUserId = this.getByUserId.bind(this);
    this.update = this.update.bind(this);
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

  async getByUserId(request, response, next) {
    try {
      const {
        user: { id }
      } = request;
      const academicInfo = await this.service.getByUserId(id);
      response.status(StatusCodes.OK).json(academicInfo);
    } catch (error) {
      next(error);
    }
  }

  async update(request, response, next) {
    try {
      const { body, user } = request;
      const academicInfoUpdated = await this.service.updateByUserId(
        user.id,
        body
      );
      response.status(StatusCodes.ACCEPTED).json(academicInfoUpdated);
    } catch (error) {
      next(error);
    }
  }
}
