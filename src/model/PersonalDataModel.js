export default class PersonalData {
  constructor(collection) {
    this.collection = collection;
  }
  async create(info) {
    return this.collection.insertOne(info);
  }

  async findByUserId(userId) {
    return this.collection.findOne({ userId });
  }

  async updateByUserId(userId, info) {
    return this.collection.updateOne({ userId }, { $set: { ...info } });
  }
}
