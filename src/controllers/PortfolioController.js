import { StatusCodes } from "http-status-codes";

export default class PortfolioController {
  constructor(portfolioService) {
    this.service = portfolioService;
    this.createPathname = this.createPathname.bind(this);
  }

  async createPathname(request, response, next) {
    try {
      const {
        body: pathname,
        user: { id }
      } = request;
      await this.service.createByUserId(id, pathname);
      response.status(StatusCodes.CREATED).end();
    } catch (error) {
      next(error);
    }
  }
}
