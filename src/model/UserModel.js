export default class UserModel {
  constructor(collection) {
    this.collection = collection;
  }

  async getUser(filter) {
    return this.collection.findOne(filter);
  }

  async createUser(user) {
    return this.collection.insertOne(user);
  }
}
