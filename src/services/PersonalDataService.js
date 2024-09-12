import { StatusCodes } from "http-status-codes";
import ApiError from "../ApiError/ApiError.js";

export default class PersonalDataService {
  constructor(personalModel) {
    this.model = personalModel;
  }

  async create(userId, info) {
    const personalData = await this.model.findByUserId(userId);
    if (personalData) {
      throw new ApiError({
        message: "User personal data already registered!",
        status: StatusCodes.CONFLICT
      });
    }

    await this.model.create({ userId, ...info });
  }

  async getByUserId(userId) {
    const personalData = await this.model.findByUserId(userId);
    if (!personalData) {
      throw new ApiError({
        message: "Not found personal data registered for this user",
        status: StatusCodes.NOT_FOUND
      });
    }
    return personalData;
  }

  async updateByUserId(userId, update) {
    const personalData = await this.model.findByUserId(userId);
    if (!personalData) {
      throw new ApiError({
        message: "Not found personal data registered for this user",
        status: StatusCodes.NOT_FOUND
      });
    }

    await this.model.updateByUserId(userId, update);

    return this.model.findByUserId(userId);
  }
}
