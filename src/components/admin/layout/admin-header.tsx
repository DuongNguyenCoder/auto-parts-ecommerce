import { AdminUserNav } from "./admin-user-nav";
import Link from "next/link";

type AdminHeaderProps = {
  email: string;
};

export function AdminHeader({ email }: AdminHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      </div>

      <div className="flex gap-5">
        <Link
          className="text-[14px] text-center rounded-xl text-foreground bg-primary/20 py-2 px-4 font-semibold"
          href={"/"}
          target="_blank"
        >
          Về Trang Chủ
        </Link>
        <AdminUserNav email={email} />
      </div>
    </header>
  );
}
