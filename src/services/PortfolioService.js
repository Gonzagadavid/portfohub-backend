import { StatusCodes } from "http-status-codes";
import ApiError from "../ApiError/ApiError.js";

export default class PortfolioService {
  constructor(
    portfolioModel,
    professionalService,
    personalDataService,
    softSkillsService,
    hardSkillsService,
    academicService,
    projectService
  ) {
    this.model = portfolioModel;
    this.professionalService = professionalService;
    this.personalDataService = personalDataService;
    this.softSkillsService = softSkillsService;
    this.hardSkillsService = hardSkillsService;
    this.academicService = academicService;
    this.projectService = projectService;
  }

  async getPortfolio(pathname) {
    const pathnameFound = await this.model.findOne({ pathname });
    if (!pathnameFound) {
      throw new ApiError({
        status: StatusCodes.NOT_FOUND,
        message: "Not found pathname"
      });
    }

    const { userId } = pathnameFound;

    const professional = await this.professionalService.getByUserId(userId);
    const personalDataInfo = await this.personalDataService.getByUserId(userId);
    const softSkills = await this.softSkillsService.getByUserId(userId);
    const hardSkills = await this.hardSkillsService.getByUserId(userId);
    const academic = await this.academicService.getByUserId(userId);
    const projects = await this.projectService.getByUserId(userId);

    const { userId: _, _id, ...personalData } = personalDataInfo;

    return {
      professional: professional?.info ?? null,
      personalData,
      softSkills: softSkills?.info ?? null,
      hardSkills: hardSkills?.info ?? null,
      academic: academic?.info ?? null,
      projects: projects?.info ?? null
    };
  }

  async getPathNameByUserId(userId) {
    const pathname = await this.model.findOne({ userId });
    if (!pathname) {
      throw new ApiError({
        status: StatusCodes.NOT_FOUND,
        message: "Not found pathname"
      });
    }

    return pathname;
  }

  async createByUserId(userId, pathname) {
    const exists = await this.model.findOne({ userId });
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
