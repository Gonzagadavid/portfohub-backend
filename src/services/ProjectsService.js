import { StatusCodes } from "http-status-codes";
import ApiError from "../ApiError/ApiError.js";

export default class ProjectsService {
  constructor(projectsModel) {
    this.model = projectsModel;
  }

  async create(userId, info) {
    const projectsData = await this.model.findByUserId(userId);
    if (projectsData) {
      throw new ApiError({
        message: "User projects info already registered!",
        status: StatusCodes.CONFLICT
      });
    }

    await this.model.create({ userId, info });
  }

  async getByUserId(userId) {
    const projectsData = await this.model.findByUserId(userId);
    if (!projectsData) {
      throw new ApiError({
        message: "Not found projects info registered for this user",
        status: StatusCodes.NOT_FOUND
      });
    }
    return projectsData;
  }

  async updateByUserId(userId, update) {
    const projectsData = await this.model.findByUserId(userId);
    if (!projectsData) {
      throw new ApiError({
        message: "Not found projects info registered for this user",
        status: StatusCodes.NOT_FOUND
      });
    }

    await this.model.updateInfoByUserId(userId, update);

    return this.model.findByUserId(userId);
  }
}
