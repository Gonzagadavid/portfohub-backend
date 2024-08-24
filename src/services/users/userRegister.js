import { StatusCodes } from "http-status-codes";
import ApiError from "../../ApiError/ApiError.js";
import User from "../../model/User.js";
import { hashValue } from "../utils/hash.js";

const userModel = new User();

export default async function userRegister({ fullName, email, password }) {
  const exists = await userModel.getUser({ email });
  if (exists) {
    throw new ApiError({
      message: `User ${email} already registered`,
      status: StatusCodes.CONFLICT
    });
  }
  const hashedPassword = await hashValue(password, +process.env.SALT_HASH);
  await userModel.createUser({
    fullName,
    email,
    password: hashedPassword
  });
}
