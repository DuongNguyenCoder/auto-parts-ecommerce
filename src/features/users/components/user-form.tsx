"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createUserSchema,
  type CreateUserDTO,
  type UpdateUserDTO,
} from "@/validations/users.schema";

const userFormSchema = createUserSchema
  .omit({
    password: true,
  })
  .extend({
    password: z.string().min(8).max(72).optional(),
  });

export type UserFormValues = z.input<typeof userFormSchema>;

type UserFormProps = {
  initialData?: Partial<CreateUserDTO>;
  onSubmit: (values: CreateUserDTO | UpdateUserDTO) => Promise<void> | void;
  submitLabel?: string;
  title?: string;
};

export const UserForm = ({
  initialData,
  onSubmit,
  submitLabel = "Save user",
  title = "User details",
}: UserFormProps) => {
  const isEdit = Boolean(initialData?.email);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: initialData?.email ?? "",
      role: initialData?.role ?? "USER",
      password: "",
    },
  });

  const onSubmitForm = async (values: UserFormValues) => {
    if (!isEdit && !values.password) {
      throw new Error("Password is required for new users.");
    }

    await onSubmit(values as CreateUserDTO | UpdateUserDTO);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className="flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-zinc-950">{title}</h2>
        <p className="text-sm text-zinc-600">
          {isEdit
            ? "Update user account and permissions."
            : "Create a new user account for the admin panel."}
        </p>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
        Email
        <Input {...register("email")} />
        {errors.email ? (
          <span className="text-sm font-normal text-red-600">
            {errors.email.message}
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
        Role
        <select
          className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-950"
          {...register("role")}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        {errors.role ? (
          <span className="text-sm font-normal text-red-600">
            {errors.role.message}
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
        Password
        <Input type="password" {...register("password")} />
        <span className="text-xs text-zinc-500">
          {isEdit
            ? "Để trống để giữ mật khẩu hiện tại."
            : "Yêu cầu mật khẩu đối với người dùng mới."}
        </span>
        {errors.password ? (
          <span className="text-sm font-normal text-red-600">
            {errors.password.message}
          </span>
        ) : null}
      </label>

      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
};
