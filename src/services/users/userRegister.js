import User from "../../model/User.js";

const userModel = new User();

export default async function userRegister({ fullName, email, password }) {
  const exists = await userModel.getUser({ email });
  if (exists) {
    throw new Error(`User ${email} already registered`);
  }
  await userModel.createUser({ fullName, email, password });
}
