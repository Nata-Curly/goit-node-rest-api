import path from "path";
import fs from "fs/promises";

import * as authServices from "../services/authServices.js";

import ctrlWrapper from "../helpers/ctrlWrapper.js";

const avatarsDir = path.resolve("public", "avatars");

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

const updateAvatarController = async (req, res) => {
  const { id } = req.user;

  if (!req.file) throw HttpError(400, "Missing file");

  const filename = req.file.filename;
  const tempPath = req.file.path;
  const finalPath = path.join(avatarsDir, filename);

  await fs.rename(tempPath, finalPath);

  const avatarURL = `/avatars/${filename}`;
  await authServices.updateAvatar({ id, avatarURL });

  res.status(200).json({ avatarURL });
};

const verifyController = async (req, res) => {
  const { verificationToken } = req.params;
  await authServices.verifyUser(verificationToken);
  res.status(200).json({ message: "Verification successful" });
};

const repeatVerifyController = async (req, res) => {
  const { email } = req.body;
  if (!email) throw HttpError(400, "Missing required field email");
  await authServices.repeatVerifyUser(email);
  res.status(200).json({ message: "Verification email sent" });
};

export default {
  registerController: ctrlWrapper(registerController),
  loginController: ctrlWrapper(loginController),
  logoutController: ctrlWrapper(logoutController),
  getCurrentController: ctrlWrapper(getCurrentController),
  updateAvatarController: ctrlWrapper(updateAvatarController),
  verifyController: ctrlWrapper(verifyController),
  repeatVerifyController: ctrlWrapper(repeatVerifyController),
};
