import User from "../../model/User.js";

const userModel = new User();

export default async function userRegister({ name, email, password }) {
  const exists = userModel.getUser({ email });
  if (exists) {
    throw new Error(`User ${email} already registered`);
  }
  await userModel.createUser({ name, email, password });
}
