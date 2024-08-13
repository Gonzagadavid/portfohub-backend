import User from "../../model/User.js";

const userModel = new User();

export default function listUsers() {
  return userModel.getUsers();
}
