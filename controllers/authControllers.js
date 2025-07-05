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

export default {
  registerController: ctrlWrapper(registerController),
  loginController: ctrlWrapper(loginController),
  logoutController: ctrlWrapper(logoutController),
  getCurrentController: ctrlWrapper(getCurrentController),
  updateAvatarController: ctrlWrapper(updateAvatarController),
};
