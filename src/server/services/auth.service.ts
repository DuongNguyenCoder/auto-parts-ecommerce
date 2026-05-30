import type { AuthSession, AuthUser } from "@/types/auth";
import type { LoginInput, RegisterInput } from "@/validations/auth.schema";
import {
  type AccessTokenPayload,
  signAccessToken,
  verifyAccessToken,
} from "@/server/auth/jwt";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { AppError } from "@/server/http/app-error";
import { userRepository } from "@/server/repositories/user.repository";

type UserRecord = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
};

const toAuthUser = (user: UserRecord): AuthUser => ({
  id: user.id,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt.toISOString(),
});

const createSession = (user: UserRecord) => {
  const tokenPayload: AccessTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: signAccessToken(tokenPayload),
    session: {
      user: toAuthUser(user),
    } satisfies AuthSession,
  };
};

export const authService = {
  register: async (input: RegisterInput) => {
    const existingUser = await userRepository.findPublicByEmail(input.email);

    if (existingUser) {
      throw new AppError("Email is already registered.", 409);
    }

    const hashedPassword = await hashPassword(input.password);
    const user = await userRepository.create({
      email: input.email,
      password: hashedPassword,
    });

    return createSession(user);
  },

  login: async (input: LoginInput) => {
    const user = await userRepository.findAuthByEmail(input.email);

    if (!user) {
      throw new AppError("Tài khoản hoặc mật khẩu không chính xác", 401);
    }

    const isPasswordValid = await verifyPassword(input.password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Tài khoản hoặc mật khẩu không chính xác.", 401);
    }

    return createSession(user);
  },

  getSession: async (accessToken: string | null) => {
    if (!accessToken) {
      throw new AppError("Authentication required.", 401);
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      throw new AppError("Invalid or expired session.", 401);
    }

    const user = await userRepository.findPublicById(payload.sub);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    return {
      user: toAuthUser(user),
    } satisfies AuthSession;
  },
};
