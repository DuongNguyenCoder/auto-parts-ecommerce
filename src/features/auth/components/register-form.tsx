"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterInput } from "@/validations/auth.schema";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Car, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const RegisterForm = () => {
  const router = useRouter();
  const { register: registerAccount, isRegistering, authError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    await registerAccount(values);

    router.push("/dang-nhap");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col rounded-2xl border border-zinc-200 bg-white px-8 py-10 shadow-sm"
    >
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
          Đăng ký tài khoản
        </h1>
        <p className="mt-1 text-sm font-light text-zinc-500">
          Chào mừng bạn - nhập thông tin để tiếp tục
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

      {authError ? <p className="text-sm text-red-600">{authError}</p> : null}

      {/* Submit */}
      <button
        type="submit"
        disabled={isRegistering}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isRegistering ? (
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
            Đang đăng ký...
          </>
        ) : (
          <>
            Đăng ký
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
        Đã có tài khoản?{" "}
        <Link
          href="/dang-nhap"
          className="font-medium text-zinc-900 underline-offset-2 hover:underline"
        >
          Đăng nhập ngay
        </Link>
      </p>
    </form>
  );
};
