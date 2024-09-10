export default class ProfessionalService {
  constructor(professionalModel) {
    this.model = professionalModel;
  }
  async create(userId, info) {
    await this.model.create({ userId, info });
  }
}
