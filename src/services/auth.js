import createHttpError from 'http-errors';
import { User } from '../db/User.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Session } from '../db/Session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/constants.js';

const createSession = () => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + FIFTEEN_MINUTES,
    refreshTokenValidUntil: Date.now() + THIRTY_DAYS,
  };
};

export const registerUser = async (payload) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await User.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  return await User.create({
    ...payload,
    password: hashedPassword,
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw createHttpError(401, 'User not found!');
  }

  const areEqual = await bcrypt.compare(password, user.password);
  if (!areEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Session.deleteOne({ userId: user._id });

  return await Session.create({
    userId: user._id,
    ...createSession(),
  });
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({
    _id: sessionId,
  });
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found!');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token is expired!');
  }

  const user = await User.findById(session.userId);

  if (!user) {
    throw createHttpError(401, 'Session not found!');
  }

  await Session.deleteOne({ _id: sessionId });

  return await Session.create({
    userId: user._id,
    ...createSession(),
  });
};
