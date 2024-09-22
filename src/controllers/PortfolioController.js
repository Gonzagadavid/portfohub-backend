import { StatusCodes } from "http-status-codes";

export default class PortfolioController {
  constructor(portfolioService) {
    this.service = portfolioService;
    this.createPathname = this.createPathname.bind(this);
    this.getPortfolio = this.getPortfolio.bind(this);
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

  async getPortfolio(request, response, next) {
    try {
      const { pathname } = request.params;
      const portfolio = await this.service.getPortfolio(pathname);

      response.status(StatusCodes.OK).json({ portfolio });
    } catch (error) {
      next(error);
    }
  }
}
