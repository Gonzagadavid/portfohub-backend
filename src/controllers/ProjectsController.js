import { StatusCodes } from "http-status-codes";

export default class ProjectsController {
  constructor(projectsService) {
    this.service = projectsService;
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
      const projectsInfo = await this.service.getByUserId(id);
      response.status(StatusCodes.OK).json(projectsInfo);
    } catch (error) {
      next(error);
    }
  }

  async update(request, response, next) {
    try {
      const { body, user } = request;
      const projectsInfoUpdated = await this.service.updateByUserId(
        user.id,
        body
      );
      response.status(StatusCodes.ACCEPTED).json(projectsInfoUpdated);
    } catch (error) {
      next(error);
    }
  }
}
