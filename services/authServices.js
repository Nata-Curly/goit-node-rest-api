import bcrypt from "bcrypt";
import gravatar from "gravatar";
import { nanoid } from "nanoid";

import User from "../db/User.js";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";
import sendEmail from "../helpers/sendEmail.js";

const { APP_DOMAIN } = process.env;

const createVerifyEmail = ({ email, verificationToken }) => ({
  to: email,
  subject: "Verify email",
  html: `<a href="${APP_DOMAIN}/api/auth/verify/${verificationToken}" target="_blank">Click to verify email</a>`,
});

export const findUser = (query) => User.findOne({ where: query });

export const registerUser = async (payload) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const verificationToken = nanoid();
  payload.avatarURL = gravatar.url(
    payload.email,
    { s: "250", r: "pg", d: "mm" },
    true
  );
  const user = await User.create({
    ...payload,
    password: hashPassword,
    verificationToken,
  });
  await sendEmail(
    createVerifyEmail({ email: payload.email, verificationToken })
  );
  return user;
};

export const verifyUser = async (verificationToken) => {
  const user = await findUser({ verificationToken });
  if (!user) throw HttpError(400, "Verification has already been passed");
  return user.update({ verify: true, verificationToken: null });
};

export const repeatVerifyUser = async (email) => {
  const user = await findUser({ email });
  if (!user || user.verify)
    throw HttpError(400, "Verification has already been passed");
  const verifyEmail = createVerifyEmail({
    email,
    verificationToken: user.verificationToken,
  });
  await sendEmail(verifyEmail);
};

export const loginUser = async ({ email, password }) => {
  const user = await findUser({ email });
  if (!user) throw HttpError(401, "Email or password is wrong");
  if (!user.verify) throw HttpError(401, "Email not verified");
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401, "Email or password is wrong");

  const payload = { id: user.id };

  const token = createToken(payload);
  user.token = token;
  await user.save();

  return {
    token,
    user: { email: user.email, subscription: user.subscription },
  };
};

export const logoutUser = async ({ email }) => {
  const user = await findUser({ email });
  if (!user) throw HttpError(401, "Not authorized");
  user.token = null;
  await user.save();
};

export const updateAvatar = async ({ id, avatarURL }) =>
  User.update({ avatarURL }, { where: { id } });
