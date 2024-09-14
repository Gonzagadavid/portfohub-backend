export class DBModel {
  constructor(collection) {
    this.collection = collection;
  }

  async findOne(filter) {
    return this.collection.findOne(filter);
  }

  async create(info) {
    return this.collection.insertOne(info);
  }

  async findByUserId(userId) {
    return this.collection.findOne({ userId });
  }

  async updateInfoByUserId(userId, info) {
    return this.collection.updateOne({ userId }, { $set: { info } });
  }

  async updateFieldsByUserId(userId, fields) {
    return this.collection.updateOne({ userId }, { $set: { ...fields } });
  }
}
