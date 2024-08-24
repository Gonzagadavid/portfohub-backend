import bcrypt from "bcryptjs";

export const hashValue = async (value, salts) => {
  const hash = await bcrypt.hash(value, salts);
  return hash;
};
