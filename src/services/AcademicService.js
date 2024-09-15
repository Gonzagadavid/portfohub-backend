import { StatusCodes } from "http-status-codes";
import ApiError from "../ApiError/ApiError.js";

export default class AcademicService {
  constructor(academicModel) {
    this.model = academicModel;
  }

  async create(userId, info) {
    const academicData = await this.model.findByUserId(userId);
    if (academicData) {
      throw new ApiError({
        message: "User academic background info already registered!",
        status: StatusCodes.CONFLICT
      });
    }

    await this.model.create({ userId, info });
  }

  async getByUserId(userId) {
    const academicData = await this.model.findByUserId(userId);
    if (!academicData) {
      throw new ApiError({
        message: "Not found academic background info registered for this user",
        status: StatusCodes.NOT_FOUND
      });
    }
    return academicData;
  }

  async updateByUserId(userId, update) {
    const academicData = await this.model.findByUserId(userId);
    if (!academicData) {
      throw new ApiError({
        message: "Not found academic background info registered for this user",
        status: StatusCodes.NOT_FOUND
      });
    }

    await this.model.updateInfoByUserId(userId, update);

    return this.model.findByUserId(userId);
  }
}
