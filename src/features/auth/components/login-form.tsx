"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput } from "@/validations/auth.schema";
import { useAuth } from "@/features/auth/hooks/use-auth";
import Link from "next/link";
import { Car, Mail } from "lucide-react";

export const LoginForm = () => {
  const router = useRouter();
  const { login, isLoggingIn, authError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    const session = await login(values);
    const searchParams = new URLSearchParams(window.location.search);
    const nextPath = searchParams.get("next");
    const safeNextPath =
      nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/";

    if (safeNextPath.startsWith("/admin") && session.user.role !== "ADMIN") {
      router.replace("/");
      return;
    }

    router.replace(safeNextPath);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col rounded-2xl border border-zinc-200 bg-white px-8 py-10 shadow-sm"
    >
      {/* Brand */}
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950">
          <Car size={18} className="text-white" />
        </div>
        <span className="text-sm font-medium tracking-tight text-zinc-900">
          Auto Thọ Xuân
        </span>
      </div>

      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-[22px] font-medium tracking-tight text-zinc-950">
          Đăng nhập
        </h1>
        <p className="mt-1 text-sm font-light text-zinc-500">
          Chào mừng trở lại - nhập thông tin để tiếp tục
        </p>
      </div>

      {/* Email */}
      <div className="mb-5">
        <label className="mb-1.5 block text-[13px] text-zinc-500">Email</label>
        <div className="relative">
          <input
            type="email"
            autoComplete="email"
            placeholder="example@email.com"
            className={`h-11 w-full rounded-xl border bg-white px-3.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition
              ${
                errors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-button-outline-border focus:border-button-primary/70"
              }`}
            {...register("email")}
          />
          <Mail
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="mb-2">
        <label className="mb-1.5 block text-[13px] text-zinc-500">
          Mật khẩu
        </label>
        <div className="relative">
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={`h-11 w-full rounded-xl border bg-white px-3.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition
              ${
                errors.password
                  ? "border-red-400 focus:border-red-500"
                  : "border-button-outline-border focus:border-button-primary/70"
              }`}
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Forgot */}
      <div className="mb-6 flex justify-end">
        <a
          href="#"
          className="text-xs text-zinc-400 transition hover:text-zinc-700"
        >
          Quên mật khẩu?
        </a>
      </div>

      {/* Auth error */}
      {authError && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {authError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoggingIn}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoggingIn ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Đang đăng nhập...
          </>
        ) : (
          <>
            Đăng nhập
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-100" />
        <span className="text-xs text-zinc-400">hoặc</span>
        <div className="h-px flex-1 bg-zinc-100" />
      </div>
      <p className="mt-5 text-center text-[13px] text-zinc-500">
        Chưa có tài khoản?{" "}
        <Link
          href="/dang-ky"
          className="font-medium text-zinc-900 underline-offset-2 hover:underline"
        >
          Đăng ký ngay
        </Link>
      </p>
    </form>
  );
};
