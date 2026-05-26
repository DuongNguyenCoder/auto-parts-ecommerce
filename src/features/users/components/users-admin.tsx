"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PaginationCustom } from "@/components/ui/pagination-custom";
import { UserForm } from "@/features/users/components/user-form";
import { userApi } from "@/features/users/api/user.api";
import type { User } from "@/types";
import type { UserListQuery } from "@/types/query/user-query.type";
import { CreateUserDTO, UpdateUserDTO } from "@/validations/users.schema";

export const UsersAdmin = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | "USER" | "ADMIN">("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const query: UserListQuery = useMemo(
    () => ({
      page,
      limit: 10,
      email: search || undefined,
      role: roleFilter || undefined,
    }),
    [page, search, roleFilter],
  );

  const usersQuery = useQuery({
    queryKey: ["users", query],
    queryFn: () => userApi.getAll(query),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Parameters<typeof userApi.create>[0]) =>
      userApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      setSelectedUser(undefined);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof userApi.update>[1];
    }) => userApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      setSelectedUser(undefined);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const openCreateModal = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleSubmit = async (values: CreateUserDTO | UpdateUserDTO) => {
    if (selectedUser) {
      await updateMutation.mutateAsync({
        id: selectedUser.id,
        payload: values,
      });
    } else {
      await createMutation.mutateAsync(values as CreateUserDTO);
    }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    await deleteMutation.mutateAsync(user.id);
  };

  const users = usersQuery.data?.data?.items ?? [];
  const totalPages = usersQuery.data?.data?.pagination.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-zinc-950">
              User management
            </h1>
            <p className="text-sm text-zinc-600">
              Manage application users, roles and access from a central panel.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by email"
              className="max-w-md"
            />
            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value as "" | "USER" | "ADMIN")
              }
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-950"
            >
              <option value="">All roles</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <Button onClick={openCreateModal}>Create user</Button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm text-zinc-700">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-900">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-8 text-center text-sm text-zinc-500"
                    colSpan={4}
                  >
                    {usersQuery.isFetching
                      ? "Loading users..."
                      : "No users found."}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-zinc-200 last:border-b-0"
                  >
                    <td className="px-4 py-4 font-semibold text-zinc-900">
                      {user.email}
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={
                          user.role === "ADMIN" ? "outline" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-zinc-700">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(user)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-4">
          <PaginationCustom
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onOpenChange={closeModal}
        title={selectedUser ? "Edit user" : "Create user"}
        description={
          selectedUser
            ? "Update the selected user account."
            : "Create a new user account for the application."
        }
        maxWidth="lg"
        loading={createMutation.isPending || updateMutation.isPending}
        preventClose={createMutation.isPending || updateMutation.isPending}
      >
        <UserForm
          initialData={selectedUser ?? undefined}
          title={selectedUser ? "Edit user" : "Create user"}
          submitLabel={selectedUser ? "Save changes" : "Create user"}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};
