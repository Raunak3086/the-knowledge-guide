import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async ({ name, email, password }) => {
  // Check if user exists
  const exist = await User.findOne({ email });
  if (exist) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  await user.save();
  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid email or password");

  return user; // includes userId, name, email
};
