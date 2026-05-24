import { AdminUserNav } from "./admin-user-nav";

type AdminHeaderProps = {
  email: string;
};

export function AdminHeader({ email }: AdminHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      </div>

      <AdminUserNav email={email} />
    </header>
  );
}
