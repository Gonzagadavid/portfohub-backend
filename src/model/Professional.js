export default class ProfessionalModel {
  constructor(collection) {
    this.collection = collection;
  }
  async create(info) {
    return this.collection.insertOne(info);
  }
}
