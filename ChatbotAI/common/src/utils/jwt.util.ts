import * as jwt from "jsonwebtoken";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || "supersecret";
const JWT_REFRESH_SECRET: jwt.Secret = process.env.JWT_REFRESH_SECRET || "supersecret_refresh";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  nonce?: string;
  iat?: number;
  exp?: number;
}

export const signAccessToken = (payload: Omit<JwtPayload, "iat" | "exp">): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: 3600,
  });
};

export const signRefreshToken = (payload: Omit<JwtPayload, "iat" | "exp">): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: 604800,
  });
};

export const verifyToken = (token: string, isRefresh = false): JwtPayload => {
  const secret = isRefresh ? JWT_REFRESH_SECRET : JWT_SECRET;
  return jwt.verify(token, secret) as JwtPayload;
};