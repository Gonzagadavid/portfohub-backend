import { StatusCodes } from "http-status-codes";
import { hashValue } from "./utils/hash.js";
import ApiError from "../ApiError/ApiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default class UserService {
  constructor(userModel) {
    this.model = userModel;
  }

  async register({ fullName, email, password }) {
    const exists = await this.model.findOne({ email });
    if (exists) {
      throw new ApiError({
        message: `User ${email} already registered`,
        status: StatusCodes.CONFLICT
      });
    }
    const hashedPassword = await hashValue(password, +process.env.SALT_HASH);
    await this.model.create({
      fullName,
      email,
      password: hashedPassword
    });
  }

  async login({ email, password }) {
    const user = await this.model.findOne({ email });

    if (!user) {
      throw new ApiError({
        message: "E-mail or password incorrect",
        status: StatusCodes.UNAUTHORIZED
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new ApiError({
        message: "E-mail or password incorrect",
        status: StatusCodes.UNAUTHORIZED
      });
    }
    const { password: _, _id, ...userInfo } = user;
    const jwtConfig = {
      algorithm: process.env.ALGORITHM,
      expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 8
    };

    return jwt.sign(
      { ...userInfo, id: _id.toString() },
      process.env.SECRET,
      jwtConfig
    );
  }
}
