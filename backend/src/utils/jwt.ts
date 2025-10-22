import jwt from 'jsonwebtoken';
import config from '../config';
import { JWTPayload, AuthTokens } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  } as any);
};

export const generateRefreshToken = (): string => {
  return uuidv4();
};

export const generateTokens = (payload: JWTPayload): AuthTokens => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken()
  };
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwt.secret) as JWTPayload;
};
