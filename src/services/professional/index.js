import { StatusCodes } from "http-status-codes";
import ApiError from "../../ApiError/ApiError.js";

export default class ProfessionalService {
  constructor(professionalModel) {
    this.model = professionalModel;
  }
  async create(userId, info) {
    const user = await this.model.findByUserId(userId);
    if (user) {
      throw new ApiError({
        message: "User professional info already registered!",
        status: StatusCodes.CONFLICT
      });
    }

    await this.model.create({ userId, info });
  }

  async getByUserId(userId) {
    const user = await this.model.findByUserId(userId);
    if (!user) {
      throw new ApiError({
        message: "Not found professional info registered for this user",
        status: StatusCodes.NOT_FOUND
      });
    }
    return user;
  }

  async updateByUserId(userId, update) {
    const user = await this.model.findByUserId(userId);
    if (!user) {
      throw new ApiError({
        message: "Not found professional info registered for this user",
        status: StatusCodes.NOT_FOUND
      });
    }

    await this.model.updateByUserId(userId, update);

    return this.model.findByUserId(userId);
  }
}
