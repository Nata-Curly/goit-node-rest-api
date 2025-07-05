import * as authServices from "../services/authServices.js";

import ctrlWrapper from "../helpers/ctrlWrapper.js";

const registerController = async (req, res) => {
  const newUser = await authServices.registerUser(req.body);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const loginController = async (req, res) => {
  const token = await authServices.loginUser(req.body);

  res.json(token);
};

const logoutController = async (req, res) => {
  await authServices.logoutUser(req.user);
  res.status(204).json();
};

const getCurrentController = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

export default {
  registerController: ctrlWrapper(registerController),
  loginController: ctrlWrapper(loginController),
  logoutController: ctrlWrapper(logoutController),
  getCurrentController: ctrlWrapper(getCurrentController),
};
