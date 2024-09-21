import { StatusCodes } from "http-status-codes";
import ApiError from "../ApiError/ApiError.js";

export default class PortfolioService {
  constructor(portfolioModel) {
    this.model = portfolioModel;
  }

  async getPathNameByUserId(userId) {
    this.model.findOne({ userId });
  }

  async createByUserId(userId, pathname) {
    const exists = await this.getPathNameByUserId(userId);
    if (exists) {
      throw new ApiError({
        status: StatusCodes.CONFLICT,
        message: "Pathname already registered to this user"
      });
    }

    const isUsed = await this.model.findOne({ pathname });
    if (isUsed) {
      throw new ApiError({
        status: StatusCodes.CONFLICT,
        message: "This pathname is already in use"
      });
    }

    await this.model.create({ userId, pathname });
  }
}
