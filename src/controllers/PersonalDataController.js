import { StatusCodes } from "http-status-codes";

export default class PersonalDataController {
  constructor(personalDataService) {
    this.service = personalDataService;
    this.create = this.create.bind(this);
    this.getByUserId = this.getByUserId.bind(this);
    this.update = this.update.bind(this);
  }
  async create(request, response, next) {
    try {
      const { body, user } = request;
      const { fullName, address, description, network, email, phrase } = body;
      await this.service.create(user.id, {
        fullName,
        address,
        description,
        network,
        email,
        phrase
      });
      response.status(StatusCodes.CREATED).end();
    } catch (error) {
      next(error);
    }
  }

  async getByUserId(request, response, next) {
    try {
      const {
        user: { id }
      } = request;
      const ProfessionalInfo = await this.service.getByUserId(id);
      response.status(StatusCodes.OK).json(ProfessionalInfo);
    } catch (error) {
      next(error);
    }
  }

  async update(request, response, next) {
    try {
      const { body, user } = request;
      const { fullName, address, description, network, email, phrase } = body;
      const updatedData = await this.service.updateByUserId(user.id, {
        fullName,
        address,
        description,
        network,
        email,
        phrase
      });
      response.status(StatusCodes.ACCEPTED).json(updatedData);
    } catch (error) {
      next(error);
    }
  }
}
