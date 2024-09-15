import { StatusCodes } from "http-status-codes";
import ApiError from "../ApiError/ApiError.js";

export default class HardSkillsService {
  constructor(hardSkillsModel) {
    this.model = hardSkillsModel;
  }

  async create(userId, info) {
    const hardSkillsData = await this.model.findByUserId(userId);
    if (hardSkillsData) {
      throw new ApiError({
        message: "User hard skills info already registered!",
        status: StatusCodes.CONFLICT
      });
    }

    await this.model.create({ userId, info });
  }

  async getByUserId(userId) {
    const hardSkillsData = await this.model.findByUserId(userId);
    if (!hardSkillsData) {
      throw new ApiError({
        message: "Not found hard skills info registered for this user",
        status: StatusCodes.NOT_FOUND
      });
    }
    return hardSkillsData;
  }

  async updateByUserId(userId, update) {
    const hardSkillsData = await this.model.findByUserId(userId);
    if (!hardSkillsData) {
      throw new ApiError({
        message: "Not found hard skills info registered for this user",
        status: StatusCodes.NOT_FOUND
      });
    }

    await this.model.updateInfoByUserId(userId, update);

    return this.model.findByUserId(userId);
  }
}
