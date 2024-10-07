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

    const { userId, template } = pathnameFound;

    const professional = await this.professionalService.getByUserId(userId);
    const personalDataInfo = await this.personalDataService.getByUserId(userId);
    const softSkills = await this.softSkillsService.getByUserId(userId);
    const hardSkills = await this.hardSkillsService.getByUserId(userId);
    const academic = await this.academicService.getByUserId(userId);
    const projects = await this.projectService.getByUserId(userId);

    const { userId: _, _id, ...personalData } = personalDataInfo;

    return {
      template,
      professional: professional?.info ?? null,
      personalData,
      softSkills: softSkills?.info ?? null,
      hardSkills: hardSkills?.info ?? null,
      academic: academic?.info ?? null,
      projects: projects?.info ?? null
    };
  }

  async getPortfolioByUserId(userId) {
    const pathnameFound = await this.model.findOne({ userId });

    const { template } = pathnameFound;

    const professional = await this.professionalService.getByUserId(userId);
    const personalDataInfo = await this.personalDataService.getByUserId(userId);
    const softSkills = await this.softSkillsService.getByUserId(userId);
    const hardSkills = await this.hardSkillsService.getByUserId(userId);
    const academic = await this.academicService.getByUserId(userId);
    const projects = await this.projectService.getByUserId(userId);

    const { userId: _, _id, ...personalData } = personalDataInfo;

    return {
      template,
      professional: professional?.info ?? null,
      personalData,
      softSkills: softSkills?.info ?? null,
      hardSkills: hardSkills?.info ?? null,
      academic: academic?.info ?? null,
      projects: projects?.info ?? null
    };
  }

  async getCheckInfo(userId) {
    const checkInfo = {
      template: false,
      pathname: false,
      professional: false,
      personalData: false,
      softSkills: false,
      hardSkills: false,
      academic: false,
      projects: false
    };

    try {
      const pathnameFound = await this.model.findOne({ userId });
      checkInfo.template = !!pathnameFound?.template;
      checkInfo.pathname = !!pathnameFound?.pathname;
    } catch {
      checkInfo.template = false;
      checkInfo.pathname = false;
    }
    try {
      const professional = await this.professionalService.getByUserId(userId);
      checkInfo.professional = !!professional?.info.length;
    } catch {
      checkInfo.professional = false;
    }
    try {
      const personalDataInfo = await this.personalDataService.getByUserId(
        userId
      );
      const { userId: _, _id, ...personalData } = personalDataInfo;
      checkInfo.personalData = !!personalData;
    } catch {
      checkInfo.personalData = false;
    }
    try {
      const softSkills = await this.softSkillsService.getByUserId(userId);
      checkInfo.softSkills = !!softSkills?.info.length;
    } catch {
      checkInfo.softSkills = false;
    }
    try {
      const hardSkills = await this.hardSkillsService.getByUserId(userId);
      checkInfo.hardSkills = !!hardSkills?.info.length;
    } catch {
      checkInfo.hardSkills = false;
    }
    try {
      const academic = await this.academicService.getByUserId(userId);
      checkInfo.academic = !!academic?.info.length;
    } catch {
      checkInfo.academic = false;
    }
    try {
      const projects = await this.projectService.getByUserId(userId);
      checkInfo.projects = !!projects?.info.length;
    } catch {
      checkInfo.projects = false;
    }

    return checkInfo;
  }

  async getPathnameByUserId(userId) {
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

  async addOrUpdateTemplate(userId, template) {
    const info = await this.model.findOne({ userId });
    if (!info) {
      throw new ApiError({
        message: "Not found portfolio template registered"
      });
    }
    await this.model.updateFieldsByUserId(userId, { template });
  }

  async getPortfolioInfo(userId) {
    const info = await this.model.findOne({ userId });
    if (!info) {
      throw new ApiError({ message: "Not found portfolio info this user" });
    }

    return info;
  }

  async pathnameIsUsed(pathname) {
    const isUsed = await this.model.findOne({ pathname });

    return !!isUsed;
  }
}
