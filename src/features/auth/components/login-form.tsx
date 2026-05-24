"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput } from "@/validations/auth.schema";
import { useAuth } from "@/features/auth/hooks/use-auth";

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
      className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-zinc-950">Sign in</h2>
        <p className="text-sm text-zinc-600">
          Access your auto parts account.
        </p>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
        Email
        <input
          type="email"
          autoComplete="email"
          className="h-11 rounded-xl border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950"
          {...register("email")}
        />
        {errors.email ? (
          <span className="text-sm font-normal text-red-600">
            {errors.email.message}
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
        Password
        <input
          type="password"
          autoComplete="current-password"
          className="h-11 rounded-xl border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950"
          {...register("password")}
        />
        {errors.password ? (
          <span className="text-sm font-normal text-red-600">
            {errors.password.message}
          </span>
        ) : null}
      </label>

      {authError ? <p className="text-sm text-red-600">{authError}</p> : null}

      <button
        type="submit"
        disabled={isLoggingIn}
        className="h-11 rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoggingIn ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};
