import { StatusCodes } from "http-status-codes";
import ApiError from "../ApiError/ApiError.js";

export default class ProfessionalService {
  constructor(professionalModel) {
    this.model = professionalModel;
  }
  async create(userId, info) {
    const professionalData = await this.model.findByUserId(userId);
    if (professionalData) {
      throw new ApiError({
        message: "User professional info already registered!",
        status: StatusCodes.CONFLICT
      });
    }

    await this.model.create({ userId, info });
  }

  async getByUserId(userId) {
    const professionalData = await this.model.findByUserId(userId);
    if (!professionalData) {
      throw new ApiError({
        message: "Not found professional info registered for this user",
        status: StatusCodes.NOT_FOUND
      });
    }
    return professionalData;
  }

  async updateByUserId(userId, update) {
    const professionalData = await this.model.findByUserId(userId);
    if (!professionalData) {
      throw new ApiError({
        message: "Not found professional info registered for this user",
        status: StatusCodes.NOT_FOUND
      });
    }

    await this.model.updateByUserId(userId, update);

    return this.model.findByUserId(userId);
  }
}
