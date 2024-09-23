import { StatusCodes } from "http-status-codes";

export default class PortfolioController {
  constructor(portfolioService) {
    this.service = portfolioService;
    this.createPathname = this.createPathname.bind(this);
    this.getPortfolio = this.getPortfolio.bind(this);
    this.addOrUpdateTemplate = this.addOrUpdateTemplate.bind(this);
    this.getPortfolioInfo = this.getPortfolioInfo.bind(this);
  }

  async createPathname(request, response, next) {
    try {
      const {
        body: { pathname },
        user: { id }
      } = request;
      console.log(pathname);
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
}
