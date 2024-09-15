import { StatusCodes } from "http-status-codes";
import ApiError from "../ApiError/ApiError.js";

export default class SoftSkillsService {
  constructor(softSkillsModel) {
    this.model = softSkillsModel;
  }

  async create(userId, info) {
    const softSkillsData = await this.model.findByUserId(userId);
    if (softSkillsData) {
      throw new ApiError({
        message: "User soft skills info already registered!",
        status: StatusCodes.CONFLICT
      });
    }

    await this.model.create({ userId, info });
  }

  async getByUserId(userId) {
    const softSkillsData = await this.model.findByUserId(userId);
    if (!softSkillsData) {
      throw new ApiError({
        message: "Not found soft skills info registered for this user",
        status: StatusCodes.NOT_FOUND
      });
    }
    return softSkillsData;
  }

  async updateByUserId(userId, update) {
    const softSkillsData = await this.model.findByUserId(userId);
    if (!softSkillsData) {
      throw new ApiError({
        message: "Not found soft skills info registered for this user",
        status: StatusCodes.NOT_FOUND
      });
    }

    await this.model.updateInfoByUserId(userId, update);

    return this.model.findByUserId(userId);
  }
}
