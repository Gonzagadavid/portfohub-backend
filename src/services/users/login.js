import { StatusCodes } from "http-status-codes";
import ApiError from "../../ApiError/ApiError.js";
import bcrypt from "bcryptjs";
import User from "../../model/User.js";
import jwt from "jsonwebtoken";

const userModel = new User();

export default async function login({ email, password }) {
  const user = await userModel.getUser({ email });

  if (!user) {
    throw new ApiError({
      message: "E-mail or password incorrect",
      status: StatusCodes.UNAUTHORIZED
    });
  }

  const passwordMatch = bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new ApiError({
      message: "E-mail or password incorrect",
      status: StatusCodes.UNAUTHORIZED
    });
  }
  const { password: _, _id, ...userInfo } = user;
  const jwtConfig = {
    algorithm: "HS256",
    expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 8
  };

  return jwt.sign(
    { ...userInfo, id: _id.toString() },
    process.env.SECRET,
    jwtConfig
  );
}
