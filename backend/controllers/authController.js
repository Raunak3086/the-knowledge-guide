import { registerUser, loginUser } from "../services/userService.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    res.json({
      message: "Registered",
      userId: user.userId,
      email: user.email,
      name: user.name
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await loginUser(req.body);

    res.json({
      message: "Login successful",
      userId: user.userId,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
