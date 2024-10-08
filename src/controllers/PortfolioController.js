import { StatusCodes } from "http-status-codes";

export default class PortfolioController {
  constructor(portfolioService) {
    this.service = portfolioService;
    this.createPathname = this.createPathname.bind(this);
    this.getPortfolio = this.getPortfolio.bind(this);
    this.addOrUpdateTemplate = this.addOrUpdateTemplate.bind(this);
    this.getPortfolioInfo = this.getPortfolioInfo.bind(this);
    this.getCheckInfo = this.getCheckInfo.bind(this);
    this.getPathname = this.getPathname.bind(this);
    this.getDataPortfolio = this.getDataPortfolio.bind(this);
    this.pathnameIsUsed = this.pathnameIsUsed.bind(this);
  }

  async createPathname(request, response, next) {
    try {
      const {
        body: { pathname },
        user: { id }
      } = request;
      await this.service.createByUserId(id, pathname);
      response.status(StatusCodes.CREATED).end();
    } catch (error) {
      next(error);
    }
  }

  async addOrUpdateTemplate(request, response, next) {
    try {
      const {
        body: { template },
        user: { id }
      } = request;
      await this.service.addOrUpdateTemplate(id, template);
      response.status(StatusCodes.CREATED).end();
    } catch (error) {
      next(error);
    }
  }

  async getPortfolio(request, response, next) {
    try {
      const { pathname } = request.params;
      const portfolio = await this.service.getPortfolio(pathname);

      response.status(StatusCodes.OK).json({ portfolio });
    } catch (error) {
      next(error);
    }
  }

  async getPortfolioInfo(request, response, next) {
    try {
      const {
        user: { id }
      } = request;
      const portfolioInfo = await this.service.getPortfolioInfo(id);

      response.status(StatusCodes.OK).json({ portfolioInfo });
    } catch (error) {
      next(error);
    }
  }

  async getCheckInfo(request, response, next) {
    try {
      const {
        user: { id }
      } = request;
      const checkInfo = await this.service.getCheckInfo(id);

      response.status(StatusCodes.OK).json({ checkInfo });
    } catch (error) {
      next(error);
    }
  }

  async pathnameIsUsed(request, response, next) {
    try {
      const { pathname } = request.params;

      const isUsed = await this.service.pathnameIsUsed(pathname);
      response.status(isUsed ? StatusCodes.CONFLICT : StatusCodes.OK).end();
    } catch (error) {
      next(error);
    }
  }

  async getPathname(request, response, next) {
    try {
      const {
        user: { id }
      } = request;
      const { pathname } = await this.service.getPathnameByUserId(id);
      response.status(StatusCodes.OK).json({ pathname });
    } catch (error) {
      next(error);
    }
  }

  async getDataPortfolio(request, response, next) {
    try {
      const {
        user: { id }
      } = request;
      const portfolio = await this.service.getPortfolioByUserId(id);

      response.status(StatusCodes.OK).json({ portfolio });
    } catch (error) {
      next(error);
    }
  }
}
